import React from 'react';
import css from './ProductReviewEmpty.module.scss';

export default function ProductReviewEmpty() {
  return (
    <div className={css.wrap}>
      <img src="/static/icon/icon_review.png" alt="reviewIcon" />
      <div className={css.bold}>작성된 상품 리뷰가 없습니다.</div>
      <div>
        첫 상품 리뷰 작성하고{' '}
        <span className={css.colored}>최대 2,000점의 포인트 혜택</span>을
        누려보세요!
      </div>
      <button>첫 리뷰 작성하기</button>
    </div>
  );
}
