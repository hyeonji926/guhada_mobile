import { observable, action, toJS } from 'mobx';
import { loginStatus } from 'constant';
import API from 'lib/API';
import Router from 'next/router';
import qs from 'qs';

const isServer = typeof window === 'undefined';

export default class CartAndPurchaseStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable associatedProduct = [];

  @action
  setShoppingCart = () => {
    let options = this.root.productoption.options;
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (options.selectedOption) {
        API.order
          .post(
            `/cart/addCartItem`,
            qs.stringify({
              dealId: this.root.productdetail.deals.dealsId,
              dealOptionId: options.selectedOption.id,
              quantity: options.selectedQuantity,
            }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
            }
          )
          .then(res => {
            let data = res.data;
            if (data.resultCode === 200) {
              API.product
                .get(
                  `/deals`,
                  qs.stringify({
                    brandId: this.root.productdetail.deals.brandId,
                    pageIndex: 0,
                    unitPerPage: 3,
                  }),
                  {
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                  }
                )
                .then(res => {
                  let data = res.data;
                  if (data.resultCode === 200) {
                    this.associatedProduct = data.data;
                    this.root.shoppingCartSuccessModal.showModal({
                      confirmText: '장바구니로 이동',
                      contentStyle: {
                        position: 'fixed',
                        width: '100%',
                        bottom: '0%',
                        top: 'none',
                        left: '50%',
                        right: 'initial',
                        transform: 'translate(-50%, 0%)',
                        background: 'transparent',
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: 0,
                      },
                      onConfirm: () => {
                        Router.push('/shoppingcart');
                      },
                    });
                  }
                });
            }
          })
          .catch(err => {
            if (this.root.login.loginStatus === 'logout') {
              this.root.alert.showAlert({
                content: '로그인 을 해주세요.',
              });
            } else {
              this.root.alert.showAlert({
                content: '서버 에러 ' + err,
              });
            }
          });
      } else {
        this.root.alert.showAlert({
          content: '옵션을 선택 해주세요.',
        });
      }
    } else {
      this.root.alert.showAlert({
        content: '로그인 을 해주세요.',
      });
    }
  };

  @action
  immediatePurchase = () => {
    let options = this.root.productoption.options;
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (options.selectedOption) {
        API.order
          .post(
            `/cart/addCartItem`,
            qs.stringify({
              dealId: this.root.productdetail.deals.dealsId,
              dealOptionId: options.selectedOption.id,
              quantity: options.selectedQuantity,
            }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
            }
          )
          .then(res => {
            let data = res.data;
            if (data.resultCode === 200) {
              Router.push({
                pathname: '/orderpayment',
                query: {
                  cartList: data.data.cartItemId,
                },
              });
            }
          })
          .catch(err => {
            if (this.root.login.loginStatus === 'logout') {
              this.root.alert.showAlert({
                content: '로그인 을 해주세요.',
              });
            } else {
              this.root.alert.showAlert({
                content: '서버 에러 ' + err,
              });
            }
          });
      } else {
        this.root.alert.showAlert({
          content: '옵션 을 선택해주세요.',
        });
      }
    } else {
      this.root.alert.showAlert({
        content: '로그인 을 해주세요.',
      });
    }
  };
  @action
  reEntryNotify = () => {
    this.root.alert.showAlert({
      content: '재입고 알림 완료(현재기능없음)',
    });
  };
}