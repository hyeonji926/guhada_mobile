import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Gallery from 'components/productdetail/Gallery';
import ProductDetailName from 'components/productdetail/ProductDetailName';
import ProductDetailOption from 'components/productdetail/ProductDetailOption';
import CartAndPurchaseButton from 'components/productdetail/CartAndPurchaseButton';
import ShippingBenefit from 'components/productdetail/ShippingBenefit';
import ProductTab from 'components/productdetail/ProductTab';
import ProductDetailContents from 'components/productdetail/ProductDetailContents';
import Tag from 'components/productdetail/Tag';
import ItemWrapper from 'components/productdetail/ItemWrapper';
import { inject, observer } from 'mobx-react';
import ProductInfo from 'components/productdetail/ProductInfo';
import { SeparateLine } from 'components/productdetail/SeparateLine';
import FoldedWrapper from 'components/productdetail/FoldedWrapper';
import ShippingReturn from 'components/productdetail/ShippingReturn';
import ProductNotifie from 'components/productdetail/ProductNotifie';
import SectionWrap from 'components/productdetail/SectionWrap';
import RelatedAndRecommend from 'components/productdetail/RelatedAndRecommend';
import SellerStoreInfo from 'components/productdetail/SellerStoreInfo';
import ProductInquiry from 'components/productdetail/ProductInquiry/ProductInquiry';
import ProductReview from 'components/productdetail/ProductReview/ProductReview';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import Coupon from 'components/productdetail/Coupon';
import _ from 'lodash';
import CommonPopup from 'components/common/modal/CommonPopup';
import SellerReview from 'components/productdetail/SellerReview/SellerReview';
import LoadingPortal from 'components/common/loading/Loading';
import { sendBackToLogin } from 'childs/lib/router';
import { devLog } from 'childs/lib/common/devLog';
@withScrollToTopOnMount
@inject(
  'searchitem',
  'productoption',
  'sellerfollow',
  'productdetail',
  'login',
  'alert',
  'mypageRecentlySeen',
  'cartAndPurchase',
  'login',
  'shoppingCartSuccessModal'
)
@observer
class ProductDetail extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = { isInternationalPopup: false, isInternationalSubmit: '',  cartAndPurchaseVisible: true};
    this.tabRefMap = {
      detailTab: React.createRef(),
      inquiryTab: React.createRef(),
      sellerstoreTab: React.createRef(),
      reviewTab: React.createRef(),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    //  ?????? ??? ????????? ?????? ????????? ??????
    const isDealsFetched =
      _.get(this, 'props.productdetail.deals.dealsId') !==
      _.get(this, 'prevProps.productdetail.deals.dealsId');

    if (isDealsFetched) {
      this.props.mypageRecentlySeen.addItem(this.props.productdetail.deals);
    }
  }

  handleSellerFollows = () => {
    const { sellerfollow, productdetail, login } = this.props;
    const follows = sellerfollow.follows;
    if (login.isLoggedIn) {
      if (follows === false) {
        sellerfollow.setSellerFollow(productdetail.deals.sellerId);
      } else if (follows === true) {
        sellerfollow.deleteSellerFollow(productdetail.deals.sellerId);
      }
    } else {
      sendBackToLogin();
    }
  };

  handleInternationalPopup = bool => {
    this.setState({
      isInternationalPopup: bool,
    });
  };

  isInternationalSubmit = text => {
    this.setState({ isInternationalSubmit: text });
  };

  submitInternationalPopup = () => {
    const { cartAndPurchase } = this.props;
    if (this.state.isInternationalSubmit === 'addShoppingCart') {
      cartAndPurchase.addShoppingCart();
    } else if (this.state.isInternationalSubmit === 'immediatePurchase') {
      cartAndPurchase.immediatePurchase();
    }
    this.setState({
      isInternationalPopup: false,
    });
  };

  /**
   * handle cart and pucrach button visible or not from ?????? ?????? visible or not
   */
  CartAndPurchaseButtonHandler = (value) => {    
    this.setState({
        cartAndPurchaseVisible : !value
      })
  }

  render() {
    const {
      deals,
      tags,
      claims,
      businessSeller,
      seller,
      dealsOfSameBrand,
      dealsOfRecommend,
      dealsOfSellerStore,
      followers,
      satisfaction,
      productoption,
      sellerfollow,
      productdetail,
      login,
      alert,
      searchitem,
      shoppingCartSuccessModal
    } = this.props;

    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={null}
        toolBar={false}
        headerShape={'productDetail'}
      >
        {/* ???????????????????????? */}
        <Gallery />

        {/* ?????? ?????? ?????? */}
        <ProductDetailName />

        {/* ??????  */}
        <Coupon />

        {/* ?????? ?????? ?????? */}
        <ProductDetailOption />

        {/* ?????? ?????? ??? ??????, ?????? ???????????? */}
        <ShippingBenefit
          deals={deals}
          satisfaction={satisfaction}
          sellerData={seller}
          shipExpenseType={productoption.shipExpenseType}
          tabRefMap={this.tabRefMap}
          sellerStore={productdetail.sellerStore}
        />

        {/* ????????????, ????????????, ??????????????? ??? */}
        <ProductTab tabRefMap={this.tabRefMap} />

        {/* ?????? ?????? ?????? */}
        <ProductDetailContents deals={deals} tabRefMap={this.tabRefMap} />

        {/* ?????? ?????? */}
        <ItemWrapper header={'??????'}>
          <Tag tags={tags} toSearch={searchitem.toSearch} />
        </ItemWrapper>

        {/* ?????? ??????, ?????? */}
        <ItemWrapper header={'?????? ??????'}>
          <ProductInfo deals={deals} />
        </ItemWrapper>
        {SeparateLine}

        {/* ?????? ?????? */}
        <ProductReview tabRefMap={this.tabRefMap} />
        {SeparateLine}

        {/* ?????? ?????? */}
        <SellerReview />
        {SeparateLine}

        {/* ?????? ?????? */}
        <SectionWrap>
          <ProductInquiry tabRefMap={this.tabRefMap} isNewInquiryVisible={this.CartAndPurchaseButtonHandler}  />
        </SectionWrap>
        {SeparateLine}

        {/* ??????/??????/????????????, ????????? ??????*/}
        <FoldedWrapper header={'??????/??????/????????????'}>
          <ShippingReturn
            deals={deals}
            claims={claims}
            businessSeller={businessSeller}
            seller={seller}
            shipExpenseType={productoption.shipExpenseType}
            sellerStore={productdetail.sellerStore}
          />
        </FoldedWrapper>
        {SeparateLine}
        {/* ?????????????????? */}
        {deals.productNotifies ? (
          <FoldedWrapper header={'??????????????????'} noline={true}>
            <ProductNotifie productNotifies={deals.productNotifies} />
          </FoldedWrapper>
        ) : null}

        {SeparateLine}
        {/* ???????????? ????????????, ???????????? */}
        <RelatedAndRecommend
          dealsOfSameBrand={dealsOfSameBrand}
          dealsOfRecommend={dealsOfRecommend}
        />
        {SeparateLine}
        {/* ??????????????? */}
        <SectionWrap style={{ paddingBottom: '60px' }}>
          <SellerStoreInfo
            deals={deals}
            dealsOfSellerStore={dealsOfSellerStore}
            followers={followers}
            sellerData={seller}
            tabRefMap={this.tabRefMap}
            handleSellerFollows={this.handleSellerFollows}
            sellerfollow={sellerfollow}
            login={login}
            alert={alert}
            sellerStore={productdetail.sellerStore}
          />
        </SectionWrap>

        {/* ?????? ?????? ???????????? , ???????????? ?????? */}
        {this.state.cartAndPurchaseVisible === true && !shoppingCartSuccessModal.isOpen? 
          <CartAndPurchaseButton isVisible = {false}
          handleInternationalPopup={this.handleInternationalPopup}
          isInternationalSubmit={this.isInternationalSubmit}
          />  : null
        }
        
        <CommonPopup 
          isOpen={this.state.isInternationalPopup}
          backgroundImage={`${
            process.env.API_CLOUD
          }/images/web/common/notice_delivery@3x.png`}
          cancelButtonText={'??????'}
          submitButtonText={'??????'}
          onCancel={() => {
            this.handleInternationalPopup(false);
          }}
          onSubmit={() => {
            this.submitInternationalPopup();
          }}
        />

        {this.props.cartAndPurchase.addCartStatus ? <LoadingPortal /> : null}
      </DefaultLayout>
    );
  }
}

export default ProductDetail;
