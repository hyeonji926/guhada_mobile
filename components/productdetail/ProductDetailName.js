import React, { Component } from 'react';
import css from './ProductDetailName.module.scss';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import Router from 'next/router';
import { sendBackToLogin } from 'childs/lib/router';

@inject(
  'productdetail',
  'productDetailBookmark',
  'productoption',
  'alert',
  'searchitem',
  'login'
)
@observer
class ProductDetailName extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.router?.query, this.props.router?.query)) {
      this.props.productDetailBookmark.productBookmarkInit();
    }
  }
  componentWillUnmount() {
    this.props.productDetailBookmark.productBookmarkInit();
  }
  copyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${
      Router.router.asPath
    }`;

    copy(productUrl);

    this.props.alert.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };

  render() {
    let {
      productdetail,
      productDetailBookmark,
      searchitem,
      login,
    } = this.props;
    let { deals } = productdetail;
    return (
      <div className={css.wrap}>
        <div className={css.inner__top}>
          <div
            className={css.brandName}
            onClick={() =>
              searchitem.toSearch({ brand: deals.brandId, enter: 'brand' })
            }
          >
            {deals.brandName}
            <span className={css.arrow} />
          </div>
          <div className={css.detail__number}>상품번호 {deals.dealId}</div>
        </div>

        <div className={css.inner__middle}>
          <div className={css.product__name}>
            {`${_.isNil(deals.season) === false ? deals.season : ''} ${
              deals.name
            }`}
          </div>
        </div>

        <div className={css.inner__bottom}>
          <div className={css.product__price__wrap}>
            <div className={css.product__discount__price}>
              {deals.discountPrice.toLocaleString()}
            </div>
            {deals.discountPrice === deals.sellPrice ? null : (
              <div className={css.product__sell__price}>
                {deals.sellPrice.toLocaleString()}
              </div>
            )}
            {deals.discountPrice === deals.sellPrice ? null : (
              <div className={css.product__discount__rate}>
                {`${deals.discountRate}%`}
              </div>
            )}
          </div>
          <div className={css.utility__wrap}>
            <div className={css.share__btn} onClick={this.copyUrlToClipboard}>
              <img src="/static/icon/m_share_btn.png" alt="공유하기" />
            </div>
            <div
              className={css.like__btn}
              onClick={() => {
                if (login.isLoggedIn) {
                  productDetailBookmark.saveBookmark(deals.productId);
                } else {
                  sendBackToLogin();
                }
              }}
            >
              {productDetailBookmark.bookMarkStatus ? (
                <img src="/static/icon/m_like_btn_on.png" alt="북마크" />
              ) : (
                <img src="/static/icon/m_like_btn_off.png" alt="북마크" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetailName;
