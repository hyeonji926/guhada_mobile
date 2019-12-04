import React, { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';

import css from './OrderCompleteDetail.module.scss';
import cn from 'classnames';
import PaymentInfo from 'components/mypage/order/PaymentInfo';
import OrderItemTable from 'components/mypage/order/OrderItemTable';
import { inject, observer } from 'mobx-react';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';

@withScrollToTopOnMount
@withRouter
@inject('orderCompleteDetail', 'orderClaimList', 'user')
@observer
class OrderCompleteDetail extends Component {
  get purchaseId() {
    return this.props.router.query.purchaseId;
  }

  componentDidMount() {
    const { orderCompleteDetail } = this.props;

    orderCompleteDetail.getOrderComplete(this.purchaseId);
  }

  render() {
    const { orderCompleteDetail } = this.props;
    const { data: orderData } = orderCompleteDetail;
    const { shippingAddress = {} } = orderData; // 배송지 정보

    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'주문내역'}
        headerShape={'mypage'}
      >
        <div className={css.wrap}>
          <div className={css.orderInfo}>
            <div className={css.orderInfo__orderId}>
              <div className={css.orderInfo__field}>
                <span className={css.orderInfo__label}>주문번호</span>
                <span className={css.orderInfo__value}>
                  {orderData.orderNumber || '-'}
                </span>
              </div>
              <div className={css.orderInfo__field}>
                <span className={css.orderInfo__label}>주문일</span>
                <span className={cn(css.orderInfo__value, css.withDivider)}>
                  {orderCompleteDetail.orderDateWithFormat}
                </span>
              </div>
            </div>

            {/* pgTid로 영수증 조회 */}
            {orderData?.pgTid && (
              <button
                className={css.orderInfo__receiptButton}
                onClick={() =>
                  orderCompleteDetail.openReceiptPopup(
                    orderCompleteDetail.receiptUrl
                  )
                }
              >
                영수증 조회
              </button>
            )}
          </div>

          <OrderItemTable orderList={orderData?.orderList} />

          {/* 구매자 정보 */}
          <div className={css.buyerInfomation}>
            <div className={css.buyerInfomation__section}>
              <MypageSectionTitle>주문자 정보</MypageSectionTitle>
              <table className={css.buyerInfomation__table}>
                <tbody>
                  <tr>
                    <td>이름</td>
                    <td>{orderData?.buyerName || '-'}</td>
                  </tr>
                  <tr>
                    <td>이메일</td>
                    {/* TODO: email 필드 없음 */}
                    <td>{orderData?.buyerEmail || '-'}</td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>{addHyphenToMobile(orderData?.buyerPhone) || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={css.buyerInfomation__section}>
              <MypageSectionTitle>배송지 정보</MypageSectionTitle>
              <table className={css.buyerInfomation__table}>
                <tbody>
                  <tr>
                    <td>배송지명</td>
                    <td>{shippingAddress.addressName}</td>
                  </tr>
                  <tr>
                    <td>배송주소</td>
                    <td>{orderCompleteDetail.addressInView}</td>
                  </tr>
                  <tr>
                    <td>받는분</td>
                    <td>{shippingAddress.receiverName}</td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>{addHyphenToMobile(shippingAddress.phone)}</td>
                  </tr>
                  <tr>
                    <td>배송 메모</td>
                    <td>{shippingAddress.message}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <MypageSectionTitle>결제 정보</MypageSectionTitle>
          <PaymentInfo order={orderData} />
        </div>
      </MypageLayout>
    );
  }
}

export default OrderCompleteDetail;
