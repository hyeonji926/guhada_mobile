import React, { useMemo } from 'react';
import Head from 'next/head';
import seo from '../constant/seo';

const HeadForSEO = ({
  title = seo.TITLE,
  description = seo.DESCRIPTION,
  asPath = '/', // widnow.location.pathname + window.location.search
  image = seo.MAIN_IMAGE, // 페이지 대표 이미지
  children,
} = {}) => {
  const url = useMemo(() => `${seo.BASE_URL}${asPath}`, [asPath]);

  return (
    <Head>
      <meta key="description" name="description" content={description} />
      <meta key="author" name="author" content={seo.AUTHOR} />
      <title key="title">{title}</title>

      {/* 쿼리스트링에 따라 다른 페이지가 표시되므로 현재 페이지의 full URL을 넣어준다 */}
      <link key="canonical" rel="canonical" href={url} />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {/* TODO: 네이버 웹마스터도구에서 발급 */}
      {/* <meta name="naver-site-verification" content="" /> */}

      {/* 페이스북 앱 아이디 */}
      {!!seo.FB_APP_ID && <meta property="fb:app_id" content={seo.FB_APP_ID} />}

      {/* opengraph Meta Tags */}
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:image" property="og:image" content={image} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:site_name" property="og:site_name" content={seo.APP_NAME} />
      <meta key="og:locale" property="og:locale" content="ko_KR" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 앱 다운로드 링크 */}
      {/* <meta property="al:ios:url" content={iosApplink} />
      <meta property="al:ios:app_store_id" content={seo.APPSTORE_ID} />
      <meta property="al:ios:app_name" content={seo.APP_NAME} />
      <meta property="al:android:url" content={androidAppLink} />
      <meta property="al:android:app_name" content={seo.APP_NAME} />
      <meta property="al:android:package" content={seo.ANDROID_PACKAGE_ID} />
      <meta property="al:web:url" content={seo.QUIZ_BUZZ_HOME_URL} /> */}

      {/* 페이지에서 사용할 헤더 추가 */}
      {children}
    </Head>
  );
};

export default HeadForSEO;
