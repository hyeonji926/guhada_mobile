import React from 'react';
import ProductDetail from '../../template/product/ProductDetail';
import { inject, observer } from 'mobx-react';
import { getParameterByName } from '../../utils';
import Loading from '../../components/common/loading/Loading';
import Router, { withRouter } from 'next/router';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import API from 'childs/lib/API';
import _ from 'lodash';
import isServer, { isBrowser } from 'childs/lib/common/isServer';
import ReactPixel from 'react-facebook-pixel';

@withScrollToTopOnMount
@withRouter
@inject('productdetail', 'productDetailLike', 'user')
@observer
class ProductDetailPage extends React.Component {
  static async getInitialProps({ req }) {
    try {
      const dealsId = isServer ? req.query.deals : Router.query.deals;
      if (dealsId) {
        const { data } = await API.product.get(`/deals/${dealsId}`);
        const deals = data.data;
        const headData = ProductDetailPage.makeMetaFromDeals(deals);

        return {
          initialState: {
            productdetail: {
              deals,
            },
          },
          initialHeadData: headData,
        };
      } else {
        return {};
      }
    } catch (e) {
      return {};
    }
  }

  static makeMetaFromDeals = (deals = {}) => {
    return {
      pageName: `${_.isNil(deals.season) === false ? `${deals.season} ` : ''}${
        deals.name
      }`,
      description: `${deals.brandName} - ${deals.name} - ${
        deals.discountPrice
      }원`,
      image: _.get(deals, 'imageUrls.0'),
    };
  };

  componentDidMount() {
    const { productdetail, productDetailLike, user } = this.props;
    let dealId = getParameterByName('deals');
    productdetail.getDeals(dealId);
    productDetailLike.getUserLike();

    // 상품 정보 가져오기
    productdetail.getDeals(dealId);

    // 크리테오 트래커
    criteoTracker.productDetail({
      email: user.userInfo?.email,
      dealId: dealId,
    });

    //facebook tracker
    // window.fbq('track', 'ViewContent');
    ReactPixel.track('ViewContent', productdetail.deals);
  }

  componentDidUpdate(prevProps) {
    let { productdetail } = this.props;

    if (prevProps.router.query.deals !== this.props.router.query.deals) {
      let dealsId = getParameterByName('deals');
      productdetail.getDeals(dealsId);
      window.scrollTo(0, 0);
    }
  }

  render() {
    let { productdetail, initialHeadData } = this.props;

    // 쿼리스트링만 변경되면서 동적으로 라우트가 변경될 때 getinitialprops가 아닌 store 데이터 사용
    const headData = !!productdetail.deals
      ? ProductDetailPage.makeMetaFromDeals(productdetail.deals)
      : initialHeadData;

    return (
      <>
        <HeadForSEO
          pageName={headData?.pageName}
          description={headData?.description}
          image={headData?.image}
          // 쿼리스트링만 변경되면서 동적으로 라우트가 변경될 때 브라우저의 경로를 넣어준다
          fullUrl={isBrowser ? `${window.location.href}` : undefined}
        />

        <div>
          {productdetail.dealsStatus ? (
            <ProductDetail
              deals={productdetail.deals}
              claims={productdetail.claims}
              tags={productdetail.dealsTag}
              businessSeller={productdetail.businessSeller}
              seller={productdetail.seller}
              dealsOfSameBrand={productdetail.dealsOfSameBrand}
              dealsOfRecommend={productdetail.dealsOfRecommend}
              dealsOfSellerStore={productdetail.dealsOfSellerStore}
              followers={productdetail.followers}
              satisfaction={productdetail.satisfaction}
            />
          ) : (
            <Loading />
          )}
        </div>
      </>
    );
  }
}

export default ProductDetailPage;
