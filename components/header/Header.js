import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import css from './Header.module.scss';
import HeaderMenu from './HeaderMenu';
import CategoryDepthMenu from './CategoryDepthMenu';
import { inject } from 'mobx-react';
import sessionStorage from 'lib/sessionStorage';
import { pushRoute } from 'lib/router';
import cn from 'classnames';
import SearchMenu from './SearchMenu';
import BrandContainer from './item/BrandContainer';

/**
 *
 * @param {string} headerShape
 * productDetail 일때 layout 변경
 */

function Header({ children, headerShape, history, shoppingcart }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isBrandVisible, setIsBrandVisible] = useState(false);
  let cartAmount = shoppingcart.globalGetUserShoppingCartList();
  let urlHistory = sessionStorage.get('urlHistory');
  return (
    <>
      {headerShape === 'keyword' ? (
        <div className={css.wrap} />
      ) : (
        <div className={css.wrap}>
          {headerShape === 'productDetail' ||
          headerShape === 'searchList' ||
          headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          (headerShape === 'address' && urlHistory !== '') ? (
            <button
              className={css.backButton}
              onClick={() => window.history.back()}
            />
          ) : null}

          {headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ? null : (
            <button
              className={css.menuButton}
              onClick={() => setIsMenuVisible(true)}
            />
          )}

          {/* 페이지 타이틀 또는 로고 렌더링 */}
          {children ? (
            <div className={css.pageTitle}>{children}</div>
          ) : (
            <Link href="/">
              <div className={css.headerLogo} />
            </Link>
          )}

          {headerShape === 'productDetail' ? (
            <Link href="/">
              <button className={css.homeButton} />
            </Link>
          ) : null}

          {headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ? null : (
            <button
              className={cn(css.searchButton, {
                [css.leftItemExist]: headerShape === 'productDetail',
              })}
              onClick={() => setIsSearchVisible(true)}
            />
          )}

          {headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ? null : (
            <Link href="/shoppingcart">
              <div className={css.cartButton}>
                <button />
                {cartAmount !== 0 ? <div>{cartAmount}</div> : null}
              </div>
            </Link>
          )}

          <HeaderMenu
            isVisible={isMenuVisible}
            onClose={() => setIsMenuVisible(false)}
            setIsCategoryVisible={setIsCategoryVisible}
            setCategoryId={setCategoryId}
            setCategoryTitle={setCategoryTitle}
            setIsBrandVisible={setIsBrandVisible}
          />

          <CategoryDepthMenu
            isVisible={isCategoryVisible}
            onBack={() => setIsCategoryVisible(false)}
            onClose={() => {
              setIsMenuVisible(false);
              setTimeout(() => {
                setIsCategoryVisible(false);
              }, 400);
            }}
            categoryId={categoryId}
            categoryTitle={categoryTitle}
          />

          <BrandContainer
            isVisible={isBrandVisible}
            onClose={() => setIsBrandVisible(false)}
          />

          <SearchMenu
            isVisible={isSearchVisible}
            onClose={() => setIsSearchVisible(false)}
          />
        </div>
      )}
    </>
  );
}
export default inject('history', 'shoppingcart')(Header);
