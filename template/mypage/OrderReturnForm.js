import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

/**
 * 주문 반품 신청 및 수정 페이지.
 *
 * TODO: form values 초기화 메소드 수정
 * TODO: form validators
 */
@withRouter
class OrderReturnForm extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>주문 반품 신청 및 수정 페이지.</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderReturnForm;
