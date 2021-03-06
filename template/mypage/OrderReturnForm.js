import React, { Component } from 'react';
import { withRouter } from 'next/router';
import css from 'components/mypage/order/OrderClaimForm.module.scss';
import cn from 'classnames';
import DetailPageLayout from 'components/layout/DetailPageLayout';
import SectionHeading from 'components/common/SectionHeading';
import { observer, inject } from 'mobx-react';
import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import QuantityControl from 'components/mypage/form/QuantityControl';
import DealOrdered from 'components/mypage/DealOrdered';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import RadioGroup from 'components/mypage/form/RadioGroup';
import tableCSS from 'components/mypage/form/KeyValueTable.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import NoInvoiceWarning from 'components/mypage/orderCancel/NoInvoiceWarning';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { Form, Field } from 'react-final-form';
import {
  composeValidators,
  notEmptyString,
  required,
  requiredWithMessage,
  maxValue,
} from 'childs/lib/common/finalFormValidators';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import {
  claimShippingPriceTypes,
  claimShippingPriceOptions,
} from 'childs/lib/constant/order/claimShippingPrice';
import isDev from 'childs/lib/common/isDev';
import { devLog } from 'childs/lib/common/devLog';
import {
  alreadySentTypes,
  alreadySentOptions,
} from 'childs/lib/constant/order/alreadySent';
import RefundInfo from 'components/mypage/orderCancel/RefundInfo';
import paymentMethod from 'childs/lib/constant/order/paymentMethod';
import FormButton from 'components/mypage/form/FormButton';
import accountService from 'childs/lib/API/order/accountService';
import { isFalsey } from 'childs/lib/common/isTruthy';
import RefundAccountInfoForm from 'components/mypage/orderCancel/RefundAccountInfoForm';
import TextArea from 'components/mypage/form/TextArea';
import _ from 'lodash';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';

/**
 * ?????? ?????? ?????? ??? ?????? ?????????.
 */
@withScrollToTopOnMount
@withRouter
@inject('orderClaimForm', 'mypageAddress', 'alert')
@observer
class OrderReturnForm extends Component {
  // ??? ??????
  // http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/orderExchangeUsingPOST
  fields = {
    // body??? ????????? ?????????
    claimShippingPriceType: 'claimShippingPriceType', // ?????? ????????? ????????????
    returnReason: 'returnReason', // ?????? ??????
    returnReasonDetail: 'returnReasonDetail',
    invoiceNo: 'invoiceNo', // ????????????
    quantity: 'quantity', // ??????
    shippingCompanyCode: 'shippingCompanyCode', // ?????????

    // TODO:????????? ????????? ?????? ????????????. ??????????????? ?????? ?????? ??????????????? ?????? ??? ??????.
    // refundBankCode: 'refundBankCode', // ????????????
    // refundBankAccountNumber: 'refundBankAccountNumber', // ????????????
    // refundBankAccountOwner: 'refundBankAccountOwner', // ?????????
    // isRefundAccountChecked: 'isRefundAccountChecked', // ??????????????? ???????????????????

    // ?????? ??????. UI??? ???????????? ?????? ??? ??????
    isAlreadySent: 'isAlreadySent', // ?????? ???????
    isUserFault: 'isUserFault', // ??????????????? ????????? ???????????? ??? ?????????
  };

  // form ?????? ?????????
  defaultInitialValues = {
    // body
    claimShippingPriceType: null,
    returnReason: null,
    returnReasonDetail: null,
    invoiceNo: null, // number
    quantity: 1,
    shippingCompanyCode: null,
    // refundBankCode: null,
    // refundBankAccountNumber: null,
    // refundBankAccountOwner: null,

    // ?????? ???
    isAlreadySent: alreadySentTypes.YES,
    isUserFault: null,
    isRefundAccountChecked: true, //  ??????????????? false??? ?????????
  };

  /**
   * ?????? ?????? request body
   */
  defaultBody = {
    claimShippingPriceType: null,
    invoiceNo: null,
    quantity: null,
    returnReason: null,
    returnReasonDetail: null,
    shippingCompanyCode: null,
  };

  get orderProdGroupId() {
    return this.props.router?.query.orderProdGroupId;
  }

  get orderClaimId() {
    return this.props.router?.query.orderClaimId;
  }

  constructor(props) {
    super(props);
    this.state = {
      initialValues: Object.assign({}, this.defaultInitialValues),
      isMyAddressModalOpen: false, // ??? ????????? ?????? ??????
    };
  }

  /**
   * ??????????????? ????????? ???????????? ??????
   */
  getIsCreate = () => {
    return isFalsey(this.props.router?.query.orderClaimId);
  };

  componentDidMount() {
    // ??? ????????? ?????????
    this.initFormValues();

    // ????????? ?????? ????????????
    this.props.mypageAddress.getAddressList();
  }

  componentWillUnmount() {
    if (!isDev) {
      this.props.orderClaimForm.resetClaimData();
    }
  }

  initFormValues = () => {
    const { query } = this.props.router;
    const { orderClaimForm } = this.props;

    // ?????? ?????? ????????? ????????????
    orderClaimForm.setClaimId({
      orderProdGroupId: query.orderProdGroupId,
      orderClaimId: query.orderClaimId,
    });

    const job = (claimData = {}) => {
      const initValues = this.getIsCreate()
        ? // ????????? ?????? ????????? ?????????
          {
            ...this.defaultInitialValues,
            quantity: claimData.quantity, // ????????? ?????? ??????.
            isRefundAccountChecked: true, // ??????????????? ?????? ?????? ?????? ??????
          }
        : // ????????? ?????? ????????? ?????????
          {
            // API ?????????
            claimShippingPriceType: claimData?.returnShippingPriceType,
            returnReason: claimData?.returnReason,
            returnReasonDetail: claimData?.returnReasonDetail,
            quantity: claimData?.quantity, // * ??????????????? ?????? ?????? ??????
            invoiceNo: claimData?.returnPickingInvoiceNo,
            shippingCompanyCode: claimData?.returnPickingShipCompany,

            // UI ??????
            isAlreadySent: !_.isNil(claimData?.returnPickingInvoiceNo)
              ? alreadySentTypes.YES
              : alreadySentTypes.NO,
            isUserFault: orderClaimForm.isClaimReasonUserFault,
          };

      // ??? ????????? ??????
      this.setState({
        initialValues: initValues,
      });

      // ?????? ?????????????????? ????????????. ????????? ????????? ?????????(?????????)?????? ??????
      orderClaimForm.getRefundResponse({
        orderProdGroupId: claimData?.orderProdGroupId,
        quantity: claimData?.quantity,
      });
    };

    // ????????? ???????????? ????????? ??? job ??????
    this.props.orderClaimForm.pushJobForClaimData(job);
  };

  /**
   * ?????? ??????
   */
  handleChangeReason = ({ reasonSelected, formApi, isUserFault, values }) => {
    // ?????? ????????????. ???????????? ?????? ?????????????????? ?????? ?????????
    formApi.change(this.fields.isUserFault, isUserFault);
    formApi.change(this.fields.returnReason, reasonSelected);
    formApi.change(this.fields.returnReasonDetail, null);

    // ????????? ??????????????????
    if (isUserFault) {
      if (
        _.isEmpty(values[this.fields.claimShippingPriceType]) ||
        _.isNil(values[this.fields.claimShippingPriceType])
      ) {
        // ??????????????? ???????????? ???????????? ??????
        formApi.change(
          this.fields.claimShippingPriceType,
          claimShippingPriceTypes.BOX
        );
      }
    } else {
      formApi.change(this.fields.claimShippingPriceType, '');
    }
  };

  handleChangeIsAlreadySent = ({ value, formApi }) => {
    // ?????? ?????? X. ????????? ?????????
    if (value === alreadySentTypes.NO) {
      formApi.change(this.fields.shippingCompanyCode, null);
      formApi.change(this.fields.invoiceNo, null);
    }
  };

  /**
   * ????????? ?????? ?????? ?????? ??????
   */
  toggleOpenAddressListModal = () => {
    this.setState((state, props) => ({
      isMyAddressModalOpen: !state.isMyAddressModalOpen,
    }));
  };

  /**
   * ???????????? ?????? ??????
   */
  isInvoiceWarningVisible({ values }) {
    return (
      values[this.fields.isAlreadySent] === alreadySentTypes.YES &&
      (_.isNil(values[this.fields.invoiceNo]) ||
        _.isEmpty(values[this.fields.invoiceNo]))
    );
  }

  /**
   * ?????? ??????
   */
  handleChangeQuantity = quantity => {
    // ????????? ??????
    this.props.orderClaimForm.getRefundResponse({
      orderProdGroupId: this.orderProdGroupId,
      quantity,
    });
  };

  /**
   * ?????? ???????????? ?????? ?????? ??? ????????? ?????? ??????
   *
   * ????????? ?????? ???????????? ?????? ????????????.
   */
  // renderRefundAccountInfo = ({ formApi, values }) => {
  //   const { orderClaimForm } = this.props;
  //   const claimData = orderClaimForm.claimData;

  //   // ?????? ???????????? ?????? ??????. ?????? ???????????? ????????????.
  //   const isRefundAccountFormVisible =
  //     this.getIsCreate() &&
  //     claimData?.paymentMethod === paymentMethod.VBANK.code;

  //   // ????????? ?????? ???????????? ?????? ??????. ?????? ?????? ???????????? ????????????.
  //   const isRefundAccontInfoVisible =
  //     !this.getIsCreate() &&
  //     claimData?.paymentMethod === paymentMethod.VBANK.code;

  //   return (
  //     <>
  //       {isRefundAccountFormVisible && (
  //         <>
  //           <SectionHeading title="?????? ????????????" />
  //           <KeyValueTable>
  //             <tr>
  //               <td>?????????</td>
  //               <td>
  //                 <div className={tableCSS.smallInputWrapper}>
  //                   <Field
  //                     name={this.fields.refundBankCode}
  //                     validate={composeValidators(required)}
  //                   >
  //                     {props => (
  //                       <div>
  //                         <Select
  //                           options={orderClaimForm.bankCodeOptions}
  //                           value={orderClaimForm.bankCodeOptions?.find(
  //                             o => o.value === props.input.value
  //                           )}
  //                           onChange={({ value }) => {
  //                             props.input.onChange(value);
  //                             // ?????????????????? ????????? ?????? ???????????? ??????
  //                             formApi.change(
  //                               this.fields.isRefundAccountChecked,
  //                               false
  //                             );
  //                           }}
  //                         />
  //                         {props.meta.submitFailed && props.meta.error && (
  //                           <div data-name="error">{props.meta.error}</div>
  //                         )}
  //                       </div>
  //                     )}
  //                   </Field>
  //                 </div>
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>????????????</td>
  //               <td>
  //                 <div className={tableCSS.smallInputWrapper}>
  //                   <Field
  //                     name={this.fields.refundBankAccountNumber}
  //                     validate={composeValidators(required, notEmptyString)}
  //                   >
  //                     {({ input, meta }) => (
  //                       <>
  //                         <Input
  //                           initialValue={input.value}
  //                           onChange={value => {
  //                             input.onChange(value);
  //                             // ?????????????????? ????????? ?????? ???????????? ??????
  //                             formApi.change(
  //                               this.fields.isRefundAccountChecked,
  //                               false
  //                             );
  //                           }}
  //                           placeholder="??????????????? ??????????????????."
  //                         />
  //                         {meta.submitFailed && meta.error && (
  //                           <div data-name="error">{meta.error}</div>
  //                         )}
  //                       </>
  //                     )}
  //                   </Field>
  //                 </div>
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>???????????? (?????????)</td>
  //               <td>
  //                 <div
  //                   className={tableCSS.smallInputWrapper}
  //                   style={{ float: 'left', marginRight: '10px' }}
  //                 >
  //                   <Field
  //                     name={this.fields.refundBankAccountOwner}
  //                     validate={composeValidators(required, notEmptyString)}
  //                   >
  //                     {props => (
  //                       <div>
  //                         <Input
  //                           initialValue={props.input.value}
  //                           onChange={value => {
  //                             props.input.onChange(value);
  //                             // ?????????????????? ????????? ?????? ???????????? ??????
  //                             formApi.change(
  //                               this.fields.isRefundAccountChecked,
  //                               false
  //                             );
  //                           }}
  //                           placeholder="??????????????? ??????????????????."
  //                         />
  //                         {props.meta.submitFailed && props.meta.error && (
  //                           <div data-name="error">{props.meta.error}</div>
  //                         )}
  //                       </div>
  //                     )}
  //                   </Field>
  //                 </div>

  //                 {/* ?????? ?????? ????????? */}
  //                 <Field
  //                   name={this.fields.isRefundAccountChecked}
  //                   validate={value => {
  //                     return !!values[this.fields.refundBankAccountNumber] &&
  //                       !!values[this.fields.refundBankCode] &&
  //                       !!values[this.fields.refundBankAccountOwner] &&
  //                       value === true
  //                       ? undefined
  //                       : '???????????? ??????????????? ????????????';
  //                   }}
  //                 >
  //                   {({ meta }) => {
  //                     return (
  //                       <>
  //                         <FormButton
  //                           type="button"
  //                           onClick={e => {
  //                             e.stopPropagation();
  //                             this.handleClickCheckAccount({ formApi });
  //                           }}
  //                         >
  //                           {!meta.error ? '?????? ??????' : '????????????'}
  //                         </FormButton>

  //                         {meta.dirty && meta.error ? (
  //                           <div data-name="error">{meta.error}</div>
  //                         ) : meta.dirty && !meta.error ? (
  //                           <div data-name="success">?????? ?????????????????????</div>
  //                         ) : null}
  //                       </>
  //                     );
  //                     // ???????????? ????????? ?????? ??????????????? ??????
  //                   }}
  //                 </Field>
  //               </td>
  //             </tr>
  //           </KeyValueTable>
  //         </>
  //       )}

  //       {/* ????????? ?????? ???????????? */}
  //       {isRefundAccontInfoVisible && (
  //         <>
  //           <SectionHeading title="?????? ????????????" />
  //           <KeyValueTable>
  //             <tr>
  //               <td>?????????</td>
  //               <td>
  //                 <div className={'textValueCell'}>
  //                   {
  //                     orderClaimForm.bankCodeOptions.find(
  //                       o => o.value === claimData?.refundBankCode
  //                     )?.label
  //                   }
  //                 </div>
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>????????????</td>
  //               <td>
  //                 <div className={'textValueCell'}>
  //                   {claimData?.refundBankAccountNumber}
  //                 </div>
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>???????????? (?????????)</td>
  //               <td>
  //                 <div className={'textValueCell'}>
  //                   {claimData?.refundBankAccountOwner}
  //                 </div>
  //               </td>
  //             </tr>
  //           </KeyValueTable>
  //         </>
  //       )}
  //     </>
  //   );
  // };

  /**
   * ?????? ?????? ????????? ??????
   */
  // handleClickCheckAccount = ({ formApi }) => {
  //   const { values } = formApi.getState();
  //   const refundBankCode = values[this.fields.refundBankCode];
  //   const refundBankAccountNumber = values[this.fields.refundBankAccountNumber];
  //   const refundBankAccountOwner = values[this.fields.refundBankAccountOwner];

  //   if (
  //     !refundBankCode ||
  //     !refundBankAccountNumber ||
  //     !refundBankAccountOwner
  //   ) {
  //     // ????????? ????????? ???????????? ???????????? ?????? ??????
  //     formApi.change(this.fields.isRefundAccountChecked, false);
  //   } else {
  //     accountService
  //       .accountCheck({
  //         bankCode: refundBankCode,
  //         bankNumber: refundBankAccountNumber,
  //         name: refundBankAccountOwner,
  //       })
  //       .then(({ data }) => {
  //         devLog(`accountCheck`, data);

  //         if (data.data?.result === true) {
  //           formApi.change(this.fields.isRefundAccountChecked, true);
  //         } else {
  //           formApi.change(this.fields.isRefundAccountChecked, false);
  //         }
  //       })
  //       .catch(e => {
  //         console.error(e);
  //         formApi.change(this.fields.isRefundAccountChecked, false);
  //       });
  //   }
  // };

  /**
   * ?????? ?????? API ??????
   */
  handleSubmit = (values = {}) => {
    const { orderProdGroupId, orderClaimId } = this.props.router.query;

    const body = Object.assign({}, this.defaultBody, {
      claimShippingPriceType: values[this.fields.claimShippingPriceType],
      invoiceNo: values[this.fields.invoiceNo],
      quantity: values[this.fields.quantity],
      returnReason: values[this.fields.returnReason],
      returnReasonDetail: values[this.fields.returnReasonDetail],
      shippingCompanyCode: values[this.fields.shippingCompanyCode],
    });

    if (this.getIsCreate()) {
      this.props.orderClaimForm.createOrderReturn(
        Object.assign(body, {
          orderProdGroupId,

          // * ??????????????? ?????????????????? ?????????
          refundBankCode: this.props.orderClaimForm.claimData?.refundBankCode,
          refundBankAccountNumber: this.props.orderClaimForm?.claimData
            .refundBankAccountNumber,
          refundBankAccountOwner: this.props.orderClaimForm?.claimData
            .refundBankAccountOwner,
          // refundBankCode: values[this.fields.refundBankCode],
          // refundBankAccountNumber: values[this.fields.refundBankAccountNumber],
          // refundBankAccountOwner: values[this.fields.refundBankAccountOwner],
        })
      );
    } else {
      this.props.orderClaimForm.updateOrderReturn(
        Object.assign(body, { orderClaimId })
      );
    }
  };

  render() {
    const { orderClaimForm } = this.props;
    const claimData = orderClaimForm.claimData || {};

    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={this.state.initialValues}
        render={({ handleSubmit, form: formApi }) => {
          const formState = formApi.getState();
          const { values, errors, initialValues } = formState;
          devLog(`formState values`, values);
          devLog(`formState errors`, errors);

          const returnReasonLabel = orderClaimForm.returnReasonOptions.find(
            o => o.value === values[this.fields.returnReason]
          )?.label;

          return (
            <DetailPageLayout pageTitle={'?????? ??????'}>
              <form onSubmit={handleSubmit}>
                <div className={css.wrap}>
                  <div className={css.orderInfo}>
                    <div className={css.orderInfo__orderId}>
                      <div className={css.orderInfo__field}>
                        <span className={css.orderInfo__label}>????????????</span>
                        <span className={css.orderInfo__value}>
                          {claimData.purchaseId || '-'}
                        </span>
                      </div>
                      <div className={css.orderInfo__field}>
                        <span className={css.orderInfo__label}>?????????</span>
                        <span className={cn(css.orderInfo__value)}>
                          {orderClaimForm.orderDateWithFormat}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <div className={css.dealWrap}>
                      <DealOrdered
                        order={orderClaimForm.claimData}
                        isSmallImage={false}
                        isBrandAndProductInSameLine={false}
                        hasOptionQuantity={true}
                        isPurchaseStatusVisible
                        isPriceVisible
                      />

                      <div
                        style={{
                          marginTop: '32px',
                        }}
                      >
                        <div
                          className={cn(css.field, css.hasChildrenInOneLine)}
                        >
                          <div className={css.field__label}>????????????</div>
                          <div className={css.field__value}>
                            <Field
                              name={this.fields.quantity}
                              validate={composeValidators(
                                maxValue(claimData?.quantity)
                              )}
                            >
                              {props => {
                                return (
                                  <QuantityControl
                                    initialValue={
                                      this.state.initialValues[
                                        this.fields.quantity
                                      ]
                                    }
                                    max={claimData?.quantity}
                                    onChange={value => {
                                      props.input.onChange(value);
                                      this.handleChangeQuantity(value);
                                    }}
                                  />
                                );
                              }}
                            </Field>
                          </div>
                        </div>
                        <div
                          className={cn(css.field, css.hasChildrenInOneLine)}
                        >
                          <div className={css.field__label}>?????????</div>
                          <div className={css.field__value}>
                            {claimData?.sellerName || '-'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={css.reasonSelectWrapper}>
                      <Field
                        name={this.fields.returnReason}
                        validate={composeValidators(required)}
                      >
                        {({ input, meta }) => {
                          return (
                            <>
                              <Select
                                placeholder="?????? ????????? ??????????????????."
                                options={orderClaimForm.returnReasonOptions}
                                value={orderClaimForm.returnReasonOptions.find(
                                  o =>
                                    o.value === values[this.fields.returnReason]
                                )}
                                onChange={({ value, userFault }) => {
                                  this.handleChangeReason({
                                    reasonSelected: value,
                                    formApi,
                                    isUserFault: userFault,
                                    values,
                                  });
                                }}
                                styles={{ height: '45px' }}
                              />
                              {meta.submitFailed && meta.error && (
                                <div className={css.errorMsg}>{meta.error}</div>
                              )}
                            </>
                          );
                        }}
                      </Field>
                    </div>

                    <div className={css.reasonTextareaWrapper}>
                      <Field
                        name={this.fields.returnReasonDetail}
                        validate={requiredWithMessage(
                          '?????? ????????? ????????? ???????????????.'
                        )}
                      >
                        {({ input, meta }) => (
                          <>
                            <TextArea
                              placeholder="?????? ????????? ????????? ???????????????."
                              onChange={input.onChange}
                              initialValue={
                                values[this.fields.returnReasonDetail]
                              }
                              style={{ height: '120px' }}
                              isInputSizeVisible={false}
                            />
                            {meta.submitFailed && meta.error && (
                              <div className={css.errorMsg}>{meta.error}</div>
                            )}
                          </>
                        )}
                      </Field>
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <MypageSectionTitle>?????? ?????????</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <div>{orderClaimForm.sellerReturnAddressInView}</div>
                      <div>
                        <span>
                          {addHyphenToMobile(claimData?.sellerReturnTelephone)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <MypageSectionTitle>?????? ?????? ??????</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <div>?????? ???????????????????</div>

                      <div className={css.radioWrapper}>
                        <Field name={this.fields.isAlreadySent}>
                          {props => {
                            return (
                              <RadioGroup
                                name={this.fields.isAlreadySent}
                                options={alreadySentOptions}
                                onChange={value => {
                                  props.input.onChange(value);

                                  this.handleChangeIsAlreadySent({
                                    formApi,
                                    value,
                                  });
                                }}
                                initialValue={props.input.value}
                                isSingleItemInLine
                              />
                            );
                          }}
                        </Field>
                      </div>

                      {/* ?????? ??????????????? ???????????? ?????? */}
                      {values[this.fields.isAlreadySent] ===
                        alreadySentTypes.YES && (
                        <>
                          <div className={css.reasonSelectWrapper}>
                            <Field
                              name={this.fields.shippingCompanyCode}
                              validate={
                                values[this.fields.isAlreadySent] ===
                                alreadySentTypes.YES
                                  ? required
                                  : undefined
                              }
                            >
                              {props => (
                                <Select
                                  placeholder="???????????? ??????????????????"
                                  options={orderClaimForm.shipCompanyOptions}
                                  onChange={option => {
                                    props.input.onChange(option.value);
                                  }}
                                  value={orderClaimForm.shipCompanyOptions.find(
                                    o => o.value === props.input.value
                                  )}
                                />
                              )}
                            </Field>
                          </div>
                          <div className={css.reasonTextareaWrapper}>
                            <Field
                              name={this.fields.invoiceNo}
                              validate={
                                values[this.fields.isAlreadySent] ===
                                alreadySentTypes.YES
                                  ? required
                                  : undefined
                              }
                            >
                              {props => (
                                <Input
                                  placeholder="??????????????? ??????????????????."
                                  type="number"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[this.fields.invoiceNo]
                                  }
                                />
                              )}
                            </Field>
                          </div>
                        </>
                      )}

                      {/* ?????? ????????? ??? ???????????? ?????? ??????  */}
                      {this.isInvoiceWarningVisible({ values }) && (
                        <NoInvoiceWarning />
                      )}
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <MypageSectionTitle>?????? ????????? ??????</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <Field name={this.fields.isUserFault}>
                        {({ input }) =>
                          input.value === null ? (
                            <div />
                          ) : input.value === true ? (
                            <div>
                              ???????????? "<b>{returnReasonLabel}</b>
                              "?????? ?????? ???????????????{' '}
                              <b>
                                {addCommaToNum(claimData?.returnShippingPrice)}
                              </b>
                              ??????{' '}
                              <b>{claimData?.returnShippingPriceTypeText}</b>
                              ?????? ???????????? ???????????????.
                            </div>
                          ) : (
                            <div>???????????? ???????????????.</div>
                          )
                        }
                      </Field>
                    </div>

                    {/* ????????? ???????????? */}
                    <div className={css.radioWrapper}>
                      {values[this.fields.isUserFault] && (
                        <Field
                          name={this.fields.claimShippingPriceType}
                          validate={required}
                        >
                          {props => (
                            <RadioGroup
                              name={this.fields.claimShippingPriceType}
                              options={claimShippingPriceOptions}
                              onChange={props.input.onChange}
                              initialValue={
                                values[this.fields.claimShippingPriceType]
                              }
                              isSingleItemInLine
                            />
                          )}
                        </Field>
                      )}
                    </div>
                  </div>

                  {/* ?????? ???????????? . ??????????????? ????????? ??????*/}
                  {orderClaimForm.isRefundEnabled && (
                    <div className={css.formSection}>
                      <MypageSectionTitle>?????? ????????????</MypageSectionTitle>
                      <RefundAccountInfoForm
                        isCreate={this.getIsCreate()}
                        fields={this.fields}
                        formApi={formApi}
                      />
                      <div className={css.refundWarning}>
                        &middot; ????????? ?????? ??? ???????????? ?????? ????????? ????????? ?????? ??????/??????
                        ?????????????????? 1~2?????????(??????, ????????? ??????)????????? ????????????
                        ????????? ???????????? ?????????.
                      </div>
                    </div>
                    
                  )}

                  <RefundInfo />

                  <SubmitButtonWrapper
                    fixedToBottom
                    wrapperStyle={{ marginTop: '60px' }}
                  >
                    <CancelButton onClick={() => this.props.router.back()}>
                      ??????
                    </CancelButton>
                    <SubmitButton disabled={!_.isEmpty(errors)}>
                      <span>?????? ??????</span>
                      {!this.getIsCreate() && <span> ??????</span>}
                    </SubmitButton>
                  </SubmitButtonWrapper>
                </div>
              </form>
            </DetailPageLayout>
          );
        }}
      />
    );
  }
}

export default OrderReturnForm;
