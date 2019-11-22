import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

/**
 * 주문 취소 ・ 교환 ・ 반품 상세
 */
@withRouter
class OrderClaimDetail extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>주문 배송 (주문 취소 ・ 교환 ・ 반품 목록)</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderClaimDetail;
