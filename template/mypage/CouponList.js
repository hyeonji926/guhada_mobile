import React, { Fragment } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageCouponTab from 'components/mypage/coupon/MypageCouponTab';
import MypageCouponEnrollment from 'components/mypage/coupon/MypageCouponEnrollment';
import MypageValidCouponList from 'components/mypage/coupon/MypageValidCouponList';
import MypageInvalidCouponList from 'components/mypage/coupon/MypageInvalidCouponList';

import { inject, observer } from 'mobx-react';
/**
 * 마이페이지 - 쿠폰
 */
@withRouter
@inject('mypageCoupon')
@observer
class CouponList extends React.Component {
  render() {
    let { mypageCoupon } = this.props;
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>
          <MypageCouponTab />

          {/* 쿠폰 리스트 */}
          {mypageCoupon.activeTab ? (
            <Fragment>
              <MypageCouponEnrollment />

              <MypageValidCouponList />
            </Fragment>
          ) : (
            <MypageInvalidCouponList />
          )}
        </div>
      </MypageLayout>
    );
  }
}

export default CouponList;