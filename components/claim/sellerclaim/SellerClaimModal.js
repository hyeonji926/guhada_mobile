import React, { useCallback, useState, useEffect, useRef } from 'react';
import css from './SellerClaimModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import MyDealSelect from './MyDealSelect';
import ClaimType from './ClaimType';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react-lite';
import memoize from 'memoize-one';
import { inject, observer } from 'mobx-react';

function SellerClaimModal({ isOpen = false, sellerId, onClose = () => {} }) {
  const { sellerClaim } = useStores();
  const [myDeal, setMyDeal] = useState('INIT');
  const [claimType, setClaimType] = useState('INIT');
  const [claim, setClaim] = useState('');
  const [claimCheck, setClaimCheck] = useState(true);
  const [title, setTitle] = useState('');
  const [titleCheck, setTitleCheck] = useState(true);
  const [attachImage, setAttachImage] = useState([]);

  const attachFileInputRef = useRef();

  const setMyDealHandler = useCallback(
    value => {
      setMyDeal(value);
      sellerClaim.setOrderGroupId(value);
    },
    [sellerClaim]
  );

  const setClaimTypeHandler = useCallback(
    value => {
      setClaimType(value);
      sellerClaim.setClaimType(value);
    },
    [sellerClaim]
  );

  const setTitleHandler = useCallback(e => {
    setTitle(e.target.value);
  }, []);

  const setClaimHandler = useCallback(
    e => {
      claim.length <= 1000
        ? setClaim(e.target.value)
        : setClaim(claim.substring(0, 1000));
    },
    [claim]
  );

  const setAttachImageArray = useCallback(
    data => {
      let arr = attachImage;
      arr.push(data);
      setAttachImage([...arr]);
    },
    [attachImage]
  );

  const deleteAttachImageArray = useCallback(
    (url, index) => {
      const arr = attachImage;
      arr.splice(index, 1);
      setAttachImage([...arr]);
      sellerClaim.deleteImage(url);
    },
    [attachImage, sellerClaim]
  );

  const createSellerClaimHandler = useCallback(
    async (title, claim, attachImage, sellerId) => {
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
        await sellerClaim.createSellerClaim(
          title,
          claim,
          attachImage,
          sellerId
        );
        onClose();
      }
    },
    [claimType, myDeal, onClose, sellerClaim]
  );

  useEffect(() => {
    if (isOpen) {
      setClaim('');
      setMyDeal('INIT');
      setClaimType('INIT');
      setTitle('');
      setAttachImage([]);
      setClaimCheck(true);
      setTitleCheck(true);
    }
  }, [isOpen]);

  useEffect(() => {
    setClaimCheck(true);
    setTitleCheck(true);
  }, [claim, title]);

  return useObserver(() => (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isOpen}>
        <div className={css.wrap}>
          <div className={css.header}>
            <div className={css.backIcon} onClick={onClose} />
            <div className={css.headerText}>????????? ????????????</div>
          </div>
          <div className={css.contentsWrap}>
            <div className={css.dealOptions}>
              <MyDealSelect
                setMyDealHandler={setMyDealHandler}
                value={myDeal}
              />
            </div>
            {myDeal ? null : (
              <div className={css.errorMessage}>??? ?????? ?????? ?????????.</div>
            )}

            <div className={css.claimType}>
              <ClaimType
                setClaimTypeHandler={setClaimTypeHandler}
                value={claimType}
              />
            </div>
            {claimType ? null : (
              <div className={css.errorMessage}>??? ?????? ?????? ?????????.</div>
            )}

            <div className={css.title}>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitleHandler(e);
                }}
                placeholder="????????? ???????????????."
              />
            </div>
            {titleCheck ? null : (
              <div className={css.errorMessage}>??? ?????? ?????? ?????????.</div>
            )}

            <div className={css.textArea}>
              <textarea
                placeholder="???????????? ????????? ???????????????"
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
              <div className={css.errorMessage}>??? ?????? ?????? ?????????.</div>
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
                ????????????
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
              ????????? ????????? ?????? ??????, ?????? ????????? ????????? ????????? ???????????????.
              ?????? ????????? ?????? ????????? <span>??????????????? > ??????</span> ??????
              ???????????? ??? ????????????.
            </div>
          </div>

          <div className={css.buttonGroup}>
            <div className={css.cancelBtn} onClick={onClose}>
              ??????
            </div>
            <div
              className={css.inquiryBtn}
              onClick={() => {
                createSellerClaimHandler(title, claim, attachImage, sellerId);
              }}
            >
              ????????????
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  ));
}

export const withSellerClaimModal = BaseComponent => {
  @inject('sellerClaim')
  @observer
  class wrappedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        // ????????? ???????????? ??????
        sellerIdToClaim: null,
        isUserRequestedSellerClaim: false,
      };
    }

    handleOpenSellerClaimModal = ({
      sellerId,
      onPossible = () => {},
      onImpossible = () => {},
    }) => {
      this.props.sellerClaim.checkIsSellerClaimPossible({
        sellerId: sellerId,
        onPossible: () => {
          this.setState(
            {
              sellerIdToClaim: sellerId,
              isUserRequestedSellerClaim: true,
            },
            () => {
              onPossible();
            }
          );
        },
        onImpossible: () => {
          this.handleCloseSellerClaimModal();
          onImpossible();
        },
      });
    };

    handleCloseSellerClaimModal = () => {
      this.setState({
        sellerIdToClaim: null,
        isUserRequestedSellerClaim: false,
      });
    };

    isSellerClaimModalOpen = memoize(
      (isSellerClaimPossible, isUserRequestedSellerClaim) => {
        return isSellerClaimPossible && isUserRequestedSellerClaim;
      }
    );

    render() {
      const passedProps = Object.assign({}, this.props, {
        // state
        sellerIdToClaim: this.state.sellerIdToClaim,
        isUserRequestedSellerClaim: this.state.isUserRequestedSellerClaim,

        // method
        handleOpenSellerClaimModal: this.handleOpenSellerClaimModal,
        handleCloseSellerClaimModal: this.handleCloseSellerClaimModal,
        isSellerClaimModalOpen: this.isSellerClaimModalOpen(
          this.props.sellerClaim.isPossible,
          this.state.isUserRequestedSellerClaim
        ),
      });

      return <BaseComponent {...passedProps} />;
    }
  }

  return wrappedComponent;
};

export default SellerClaimModal;
