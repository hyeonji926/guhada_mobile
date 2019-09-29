import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentAgreement.module.scss';
@inject('orderpayment')
@observer
class PaymentAgreement extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <label>
          <input
            type="checkbox"
            onChange={() => {
              orderpayment.orderPaymentAgreement();
            }}
            defaultChecked={orderpayment.status.orderPaymentAgreement}
          />
          <div />
          <span>[필수] </span>
          구매 및 결제대행서비스 이용약관 동의
        </label>
        <div className={css.agreementText}>
          <a
            href={`${process.env.HOSTNAME}/terms/purchase`}
            target="_blank"
            rel="noopener noreferrer"
          >
            보기
          </a>
        </div>
      </div>
    );
  }
}

export default PaymentAgreement;
