import React, { Component } from 'react';
import css from './ShippingBenefit.module.scss';
import StarItem from './StarItem';
import { inject, observer } from 'mobx-react';

@inject('productoption')
class ShippingBenefit extends Component {
  state = {
    benefitHandle: false,
  };
  benefitHandler = () => {
    this.setState({
      benefitHandle: !this.state.benefitHandle,
    });
  };
  render() {
    const { deals, satisfaction, seller, productoption } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.itemWrap}>
          <div className={css.itemTitle}>배송정보</div>
          <div className={css.contentsWrap}>
            <div>무료배송</div>
          </div>
        </div>
        <div
          className={css.itemWrap}
          onClick={() => {
            this.benefitHandler();
          }}
        >
          <div className={css.itemTitle}>혜택정보</div>
          <div className={css.contentsWrap}>
            {productoption.benefitPoint > 0 ? <div>포인트 적립</div> : null}
            <div>무이자 할부</div>
            <div>카드추가혜택</div>
            <div
              className={css.plusIcon}
              style={
                this.state.benefitHandle
                  ? {
                      backgroundImage: 'url("/static/icon/minus_icon_m.png")',
                    }
                  : {
                      backgroundImage: 'url("/static/icon/plus_icon_m.png")',
                    }
              }
            />
          </div>
        </div>
        {this.state.benefitHandle ? (
          <div className={css.benefitDetailWrap}>
            {productoption.benefitPoint > 0 ? (
              <div className={css.benefitDetailSection}>
                <div className={css.benefitDetaieTitle}>포인트 적립</div>
                <div className={css.benefitDetailContent}>
                  {`추가 적립 포인트 ${productoption.benefitPoint.toLocaleString()}P`}
                </div>
              </div>
            ) : null}

            <div className={css.benefitDetailSection}>
              <div className={css.benefitDetaieTitle}>무이자 할부</div>
              <div className={css.benefitDetailContent}>5만원 이상 무이자</div>
            </div>
            <div className={css.benefitDetailSection}>
              <div className={css.benefitDetaieTitle}>카드추가혜택</div>
              <div className={css.benefitDetailContent}>
                제휴카드 결제 시 최대 12% 할인
              </div>
            </div>
          </div>
        ) : null}
        <div className={css.sellerWrap}>
          <div className={css.profile} />
          <div>
            <div>
              <div className={css.infoTop}>
                <div className={css.sellerName}>{deals.sellerName}</div>
                <div>
                  <div className={css.levelWrap}>
                    <div>1</div>
                  </div>
                  <div className={css.sellerGrade}>*파워셀러</div>
                </div>
              </div>
              <div className={css.infoWrap}>
                <div>
                  <button className={css.colored}>팔로우</button>
                </div>
                <div>
                  <button>셀러스토어</button>
                </div>
              </div>
            </div>
            <div className={css.satisfaction}>
              <div className={css.good}>
                만족 {satisfaction ? satisfaction.good : null}명
              </div>
              <div className={css.usual}>
                보통 {satisfaction ? satisfaction.normal : null}명
              </div>
              <div className={css.bad}>
                불만족 {satisfaction ? satisfaction.bad : null}명
              </div>
            </div>
          </div>
        </div>
        <div className={css.itemWrap}>
          <div className={css.itemTitle}>상품리뷰</div>
          <div className={css.contentsWrap}>
            <div className={css.itemContents}>
              <StarItem /> *0
            </div>
            <div className={css.itemContents}>
              *0건
              <div className={css.arrowR} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingBenefit;
