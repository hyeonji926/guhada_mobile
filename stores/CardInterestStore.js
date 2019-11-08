import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import { devLog } from 'lib/devLog';
export default class CardInterestStore {
  @observable couponIsOpen = false;
  @observable cardInterestIsOpen = false;
  @observable cardInterest = [];

  @action
  getCardInterest = () => {
    API.settle.get(`/payment/cardInterest`).then(res => {
      devLog(res, 'card interest res');
      this.cardInterest = res.data.data;
      this.cardInterestIsOpen = true;
    });
  };

  @action
  closeCardInterest = () => {
    this.cardInterestIsOpen = false;
  };
}
