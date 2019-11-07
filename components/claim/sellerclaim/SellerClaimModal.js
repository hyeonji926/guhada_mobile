import React, { useState, useEffect, useRef } from 'react';
import css from './SellerClaimModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import MyDealSelect from './MyDealSelect';
import ClaimType from './ClaimType';
import { inject } from 'mobx-react';

function SellerClaimModal({ isVisible, sellerId, sellerClaim, onClose }) {
  const [myDeal, setMyDeal] = useState('INIT');
  const [claimType, setClaimType] = useState('INIT');
  const [claim, setClaim] = useState('');
  const [claimCheck, setClaimCheck] = useState(true);
  const [title, setTitle] = useState('');
  const [titleCheck, setTitleCheck] = useState(true);
  const [attachImage, setAttachImage] = useState([]);

  const attachFileInputRef = useRef();

  function setMyDealHandler(value) {
    setMyDeal(value);
    sellerClaim.setOrderGroupId(value);
  }

  function setClaimTypeHandler(value) {
    setClaimType(value);
    sellerClaim.setClaimType(value);
  }

  function setTitleHandler(e) {
    setTitle(e.target.value);
  }

  function setClaimHandler(e) {
    claim.length <= 1000
      ? setClaim(e.target.value)
      : setClaim(claim.substring(0, 1000));
  }

  function setAttachImageArray(data) {
    let arr = attachImage;
    arr.push(data);
    setAttachImage([...arr]);
  }

  function deleteAttachImageArray(url, index) {
    const arr = attachImage;
    arr.splice(index, 1);
    setAttachImage([...arr]);
    sellerClaim.deleteImage(url);
  }

  function createSellerClaimHandler(title, claim, attachImage, sellerId) {
    if (myDeal === 'INIT') {
      setMyDeal(false);
      return false;
    } else if (claimType === 'INIT') {
      setClaimType(false);
      return false;
    } else if (title === '') {
      setTitleCheck(false);
      return false;
    } else if (claim === '') {
      setClaimCheck(false);
      return false;
    }

    if (myDeal && claimType && title && claim) {
      sellerClaim.createSellerClaim(title, claim, attachImage, sellerId);
    }
  }

  useEffect(() => {
    setClaim('');
    setMyDeal('INIT');
    setClaimType('INIT');
    setTitle('');
    setAttachImage([]);
    setClaimCheck(true);
    setTitleCheck(true);
  }, [sellerClaim.isPossible]);

  useEffect(() => {
    setClaimCheck(true);
    setTitleCheck(true);
  }, [claim, title]);

  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <div className={css.header}>
            <div className={css.backIcon} onClick={onClose} />
            <div className={css.headerText}>판매자 문의하기</div>
          </div>
          <div className={css.contentsWrap}>
            <div className={css.dealOptions}>
              <MyDealSelect
                setMyDealHandler={setMyDealHandler}
                value={myDeal}
              />
            </div>
            {myDeal ? null : (
              <div className={css.errorMessage}>이 값은 필수 입니다.</div>
            )}

            <div className={css.claimType}>
              <ClaimType
                setClaimTypeHandler={setClaimTypeHandler}
                value={claimType}
              />
            </div>
            {claimType ? null : (
              <div className={css.errorMessage}>이 값은 필수 입니다.</div>
            )}

            <div className={css.title}>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitleHandler(e);
                }}
                placeholder="제목을 입력하세요."
              />
            </div>
            {titleCheck ? null : (
              <div className={css.errorMessage}>이 값은 필수 입니다.</div>
            )}

            <div className={css.textArea}>
              <textarea
                placeholder="문의하실 내용을 입력하세요"
                onChange={e => {
                  setClaimHandler(e);
                }}
                onBlur={e => {
                  setClaimHandler(e);
                }}
                value={claim}
                maxLength="1000"
              />
            </div>
            {claimCheck ? null : (
              <div className={css.errorMessage}>이 값은 필수 입니다.</div>
            )}
            <div className={css.textNumberChecker}>
              <span>{claim.length}</span>
              /1000
            </div>

            <div className={css.attachmentFile}>
              <button
                className={css.fileAttachment__photoButton}
                onClick={() => {
                  attachFileInputRef.current.click();
                }}
                type="button"
              >
                첨부파일
              </button>

              <input
                style={{ display: 'none' }}
                type="file"
                ref={attachFileInputRef}
                onChange={e => {
                  sellerClaim.uploadImage(e, setAttachImageArray);
                }}
              />
            </div>
            {attachImage.length > 0 ? (
              <div className={css.attachImageWrap}>
                {attachImage.map((data, index) => {
                  return (
                    <div
                      className={css.attachImage}
                      style={{ backgroundImage: `url(${data})` }}
                      key={index}
                    >
                      <div
                        className={css.attachImageDelete}
                        onClick={() => {
                          deleteAttachImageArray(data.url, index);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className={css.notify}>
              구매한 상품이 없을 경우, 상품 문의를 통하여 문의가 가능합니다.
              문의 내용에 대한 답변은 <span>마이페이지 > 문의</span> 에서
              확인하실 수 있습니다.
            </div>
          </div>

          <div className={css.buttonGroup}>
            <div className={css.cancelBtn} onClick={onClose}>
              취소
            </div>
            <div
              className={css.inquiryBtn}
              onClick={() => {
                createSellerClaimHandler(title, claim, attachImage, sellerId);
              }}
            >
              문의하기
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('sellerClaim')(SellerClaimModal);