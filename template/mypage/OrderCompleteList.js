import React, { Component } from 'react';
import { withRouter } from 'next/router';
import css from './OrderCompleteList.module.scss';
import MypageLayout, {
  MypageContentsWrap,
} from 'components/mypage/MypageLayout';
import PeriodSelector, {
  DEFAULT_PERIOD,
  DEFAULT_TAB_IN_USE,
} from 'components/mypage/PeriodSelector';
import { dateUnit } from 'childs/lib/constant';
import OrderDashboard from 'components/mypage/order/OrderDashboard';
import { inject, observer } from 'mobx-react';
import { scrollToTarget } from 'childs/lib/common/scroll';
import moment from 'moment';
import { pushRoute } from 'childs/lib/router';
import _ from 'lodash';
import { LoadingSpinner } from 'components/common/loading/Loading';
import EmptyListNoti from 'components/mypage/EmptyListNoti';
import OrderItem from 'components/mypage/order/OrderItem';
import Pagination from 'components/common/Pagination';
import OrderAddressEditModal from 'components/mypage/order/OrderAddressEditModal';
// import MypageAddressModal from 'components/mypage/address/MypageAddressModal';
// import ReviewWriteModal, {
//   reviewModalType,
// } from 'components/mypage/review/ReviewWriteModal';
// import DeliveryTrackingModal from 'components/mypage/shipping/DeliveryTrackingModal';
// import SellerClaimModal from 'components/claim/sellerclaim/SellerClaimModal';
// import LoadingPortal from 'components/common/loading/Loading';
// import PointSavingModal, {
//   pointSavingTypes,
// } from 'components/mypage/point/PointSavingModal';
// import OrderConfirmModal from 'components/mypage/order/OrderConfirmModal';

/**
 * 마이페이지 - 주문 배송 (주문 완료 목록)
 */
@withRouter
@inject(
  'orderCompleteList'
  // 'mypageAddress',
  // 'mypagereview',
  // 'myDelivery',
  // 'mypagePoint'
)
@observer
class OrderCompleteList extends Component {
  constructor(props) {
    super(props);

    const { router } = this.props;

    this.state = {
      // 날짜 선택 UI 초기값. 쿼리스트링에서 가져와 초기화한다
      initialPeriodData: {
        period: {
          startDate: moment(router.query.startDate || DEFAULT_PERIOD.startDate),
          endDate: moment(router.query.endDate || DEFAULT_PERIOD.endDat),
        },
        tabInUse: router.query.tabInUse || DEFAULT_TAB_IN_USE,
        defaultTabIndex: router.query.defaultTabIndex || 0,
      },

      // 판매자 문의하기 모달
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: false,
      },
    };
  }

  defaultPeriodTabItems = [
    { value: 1, unit: dateUnit.WEEK },
    { value: 1, unit: dateUnit.MONTH },
    { value: 3, unit: dateUnit.MONTH },
    { value: 1, unit: dateUnit.YEAR },
  ];

  // 대쉬보드 id. 스크롤에 사용한다
  dashboardElementId = 'OrderDashboard';

  periodClickCount = 0;

  componentDidMount() {
    this.initOrdersWithQuery(this.props.router.query);
  }

  componentWillUnmount() {
    this.props.orderCompleteList.emtpyList();
  }

  get emtpyListMessage() {
    // TODO: 기간에 따라 메시지 달라져야 함
    return `주문 내역이 없습니다`;
  }

  initOrdersWithQuery = (query = {}) => {
    const { initialPeriodData } = this.state;

    const {
      startDate = initialPeriodData.period.startDate,
      endDate = initialPeriodData.period.endDate,
      tabInUse = initialPeriodData.tabInUse,
      defaultTabIndex = initialPeriodData.defaultTabIndex,
      page = 1,
    } = query;

    this.getOrders({ startDate, endDate, page });

    this.setInitialPeriodWithQuery({
      startDate,
      endDate,
      tabInUse,
      defaultTabIndex,
    });
  };

  getOrders = ({ startDate, endDate, page }) => {
    this.props.orderCompleteList.getMyOrderStatus();

    // 주문 완료 목록
    this.props.orderCompleteList.getMyOrders({
      startDate,
      endDate,
      pageNo: page,
    });
  };

  setInitialPeriodWithQuery = ({
    startDate,
    endDate,
    tabInUse,
    defaultTabIndex,
  }) => {
    if (!!startDate && !!endDate && !!tabInUse) {
      this.setState({
        initialPeriodData: {
          period: {
            startDate,
            endDate,
          },
          tabInUse: tabInUse,
          defaultTabIndex,
        },
      });
    }
  };

  /**
   * 기간 선택 후 주문 목록 조회
   */
  handleChangePeriod = (
    query = {
      startDate: '2019-01-01',
      endDate: '2019-01-01',
      tabInUse: DEFAULT_TAB_IN_USE,
      defaultTabIndex: 0,
    }
  ) => {
    const updatedQuery = {
      ...query,
      page: 1, // 기간 변경시 페이지는 1로 초기화
    };
    this.initOrdersWithQuery(updatedQuery);
    this.pushRouteToGetList(updatedQuery);
  };

  /**
   * 페이지 선택
   */
  handleChangePage = page => {
    scrollToTarget({ id: this.dashboardElementId, behavior: 'auto' });

    const updatedQuery = {
      ...this.props.router.query,
      page, // 기간 변경시 페이지는 1로 초기화
    };

    this.initOrdersWithQuery(updatedQuery);
    this.pushRouteToGetList(updatedQuery);
  };

  /**
   * 쿼리스트링 기반으로 목록 가져오기
   */
  pushRouteToGetList = (requestedQuery = {}) => {
    const query = {
      ...this.props.router.query,
      ...requestedQuery,
    };

    pushRoute(this.props.router.asPath, {
      query: _.omitBy(query, _.isNil),
    });
  };

  handleOpenSellerClaimModal = (order = {}) => {
    this.setState({
      sellerClaimModal: {
        sellerId: order.sellerId,
        orderProdGroupId: order.orderProdGroupId,
        isOpen: true,
      },
    });
  };

  handleCloseSellerClaimModal = () => {
    this.setState({
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: false,
      },
    });
  };

  render() {
    const {
      orderCompleteList: orderCompleteListStore,
      // mypagereview,
      // mypagePoint: mypagePointStore,
    } = this.props;

    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'주문배송'}
        headerShape={'mypage'}
      >
        <PeriodSelector
          initialData={this.state.initialPeriodData}
          defaultTabItems={this.defaultPeriodTabItems}
          monthlyTabRange={0}
          onChangePeriod={this.handleChangePeriod}
        />

        <MypageContentsWrap wrapperStyle={{ paddingTop: '10px' }}>
          <OrderDashboard data={orderCompleteListStore.myOrderStatus} />

          <div className={css.listWrap}>
            {orderCompleteListStore.isLoadingList && (
              <LoadingSpinner isAbsolute />
            )}

            {orderCompleteListStore.isNoResults ? (
              <EmptyListNoti message={this.emtpyListMessage} />
            ) : (
              orderCompleteListStore.list.map((order, index) => {
                return (
                  <OrderItem
                    key={index}
                    order={order}
                    onClickInquire={this.handleOpenSellerClaimModal}
                    isClaim={false}
                    redirectToDetail={() =>
                      orderCompleteListStore.redirectToOrderCompleteDetail({
                        purchaseId: order.purchaseId,
                      })
                    }
                  />
                );
              })
            )}
          </div>

          <div className={css.paginationWrap}>
            <Pagination
              initialPage={parseInt(orderCompleteListStore.page, 10)}
              onChangePage={this.handleChangePage}
              itemsCountPerPage={orderCompleteListStore.itemsCountPerPage}
              totalItemsCount={orderCompleteListStore.count}
            />
          </div>
        </MypageContentsWrap>

        {/* 주소 수정 모달 */}
        {/* <MypageAddressModal /> */}

        {/* 리뷰 작성 모달 */}
        {/* <ReviewWriteModal
            isOpen={mypagereview.isReviewWriteModalOpen}
            handleModalClose={mypagereview.closeReviewModal}
            modalData={mypagereview.orderProdGroup} // 선택한 주문 데이터
            status={reviewModalType.WRITE}
            onSuccessSubmit={() => {
              mypagereview.closeReviewModal();
              orderCompleteListStore.getMyOrders(); //  목록 새로고침
            }}
          /> */}

        {/* 리뷰 수정 모달 */}
        {/* <ReviewWriteModal
            isOpen={mypagereview.isReviewModifyModalOpen}
            handleModalClose={mypagereview.closeReviewModal}
            modalData={mypagereview.orderProdGroup} // 선택한 주문 데이터
            status={reviewModalType.MODIFY}
            reviewData={mypagereview.reviewData}
            onSuccessModify={() => {
              mypagereview.closeReviewModal();
              orderCompleteListStore.getMyOrders(); //  목록 새로고침
            }}
          /> */}

        {/* 배송 조회 모달. 컨트롤은 store에서 */}
        {/* <DeliveryTrackingModal /> */}

        {/* 주문 배송지 수정 모달 */}
        <OrderAddressEditModal
          isOpen={orderCompleteListStore.isOrderAddressEditModalOpen}
          onClose={orderCompleteListStore.closeOrderAddressEditModal}
          initialAddressValues={
            orderCompleteListStore.orderAddressEditModalInitialValue
          }
          purchaseId={orderCompleteListStore.orderAddressEditModalPurchaseId}
          updateShippingAddress={orderCompleteListStore.updateShippingAddress}
        />

        {/* 판매자 문의하기 모달 */}
        {/* <SellerClaimModal
            sellerId={this.state.sellerClaimModal.sellerId}
            orderProdGroupId={this.state.sellerClaimModal.orderProdGroupId}
            isOpen={this.state.sellerClaimModal.isOpen}
            onClose={this.handleCloseSellerClaimModal}
          /> */}

        {/* 구매확정시 포인트 지급 모달  */}
        {/* <PointSavingModal
            pointSavingType={pointSavingTypes.CONFIRM_PURCHASE}
            isOpen={mypagePointStore.isPointSavingModalOpen}
            onClose={mypagePointStore.closePointSavingModalOpen}
            savedPointResponse={mypagePointStore.savedPointResponse}
          /> */}

        {/* <OrderConfirmModal
            isOpen={orderCompleteListStore.isOrderConfirmModalOpen}
            order={orderConfirmModalData?.order}
            onConfirm={orderConfirmModalData?.onConfirm}
            onClose={orderConfirmModalData?.onClose}
            dueSavePointOnConfirm={orderConfirmModalData.dueSavePointOnConfirm}
            dueSavePointOnReview={orderConfirmModalData.dueSavePointOnReview}
          /> */}
      </MypageLayout>
    );
  }
}

export default OrderCompleteList;
