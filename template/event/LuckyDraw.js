import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DefaultLayout, { MainContents } from 'components/layout/DefaultLayout';
import css from './LuckyDraw.module.scss';
import LuckydrawTimer from 'components/event/luckydraw/LuckydrawTimer';
import LuckyDrawMainSlider from 'components/event/luckydraw/LuckyDrawMainSlider';
import LuckyDrawItem from 'components/event/luckydraw/LuckyDrawItem';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import { useObserver } from 'mobx-react-lite';
import useStores from 'stores/useStores';
import copy from 'copy-to-clipboard';
import { devLog } from 'childs/lib/common/devLog';
import { pushRoute } from 'lib/router';

const enhancer = compose(withRouter);

function LuckyDraw({ router }) {
  const { luckyDraw: luckyDrawStore, alert: alertStore } = useStores();

  useEffect(() => {
    luckyDrawStore.getLuckyDrawList();
    return () => {};
  }, [luckyDrawStore]);

  const handleClickShareButton = useCallback(() => {
    copy(`${window.location.host}${router.asPath}`);
    alertStore.showAlert('공유 링크가 클립보드에 복사되었습니다.');
  }, [alertStore, router.asPath]);

  // 첫번째 항목
  const firstItem = useMemo(() => {
    return luckyDrawStore.luckyDrawData?.luckyDrawList?.find((_, i) => i === 0);
  }, [luckyDrawStore.luckyDrawData]);

  const isCountdownVisible = useMemo(() => {
    return (
      firstItem?.remainedTimeForStart <= 0 && firstItem?.remainedTimeForEnd >= 0
    );
  }, [firstItem]);

  devLog(`firstItem`, firstItem);

  return useObserver(() => (
    <DefaultLayout
      pageStyle={{
        backgroundColor: '#13182e',
      }}
    >
      <div className={css.wrap}>
        <main className={css.main}>
          <div className={css.slideWrap}>
            <LuckyDrawMainSlider
              imageList={luckyDrawStore.luckyDrawData?.titleList}
            />
          </div>

          {isCountdownVisible && (
            <div className={css.timerWrap}>
              <LuckydrawTimer initialTimeLeft={firstItem?.remainedTimeForEnd} />
            </div>
          )}

          <div className={css.listWrap}>
            {luckyDrawStore.luckyDrawData?.luckyDrawList?.map((data, index) => {
              return (
                <LuckyDrawItem key={index} data={data} isFirst={index === 0} />
              );
            })}
          </div>

          <div className={css.notificationBox}>
            <img
              src="/static/icon/event/luckydraw-notification.png"
              alt="공지사항"
            />
          </div>

          <div className={css.loginArea}>
            <button
              className={css.loginArea__button}
              onClick={handleClickShareButton}
            >
              이벤트 공유하기
            </button>
            <button
              className={css.loginArea__button}
              onClick={() => pushRoute('/login')}
            >
              회원가입 · 로그인
            </button>
          </div>
        </main>
      </div>
    </DefaultLayout>
  ));
}

export default enhancer(LuckyDraw);
