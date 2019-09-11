import { computed, observable, action, toJS } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/isServer';

const isServer = typeof window === 'undefined';

export default class MainStore {
  @observable unitPerPage = 6;
  @observable plusItem = [];
  @observable newArrivals = [];
  @observable hits = [];
  @observable navDealId = '';

  constructor() {
    this.getPlusItem();
    this.getNewArrivals();
    this.getHits();
  }

  @action
  setNavDealId = id => {
    this.navDealId = id;
  };
  @action
  getPlusItem = () => {
    API.product
      .get('/main-home/deals/plus-item', {
        params: {
          unitPerPage: this.unitPerPage,
        },
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.plusItem = res.data.data;
        }
      });
  };

  @action
  getNewArrivals = () => {
    API.product
      .get('/main-home/deals/new-arrivals', {
        params: {
          unitPerPage: this.unitPerPage,
        },
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.newArrivals = res.data.data;
        }
      });
  };

  @action
  getHits = () => {
    API.search
      .get('/ps/hits/list', {
        params: {
          unitPerPage: this.unitPerPage,
        },
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.hits = res.data.data;
        }
      });
  };
}