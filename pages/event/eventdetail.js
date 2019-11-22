import React, { Component } from 'react';
import EventDetail from 'template/event/EventDetail';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import Router from 'next/router';
import _ from 'lodash';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';

@inject('eventmain')
@observer
class eventdetail extends Component {
  static async getInitialProps({ req }) {
    try {
      const eventId = isServer ? req.params?.id : Router.query.id;
      const { data } = await API.settle.get(`/event/list/detail?`, {
        params: {
          eventId,
        },
      });
      const eventData = data.data;

      const headData = {
        pageName: eventData.eventTitle,
        description: `구하다 이벤트 "${eventData.eventTitle}". ${moment(
          eventData.eventStartDate
        ).format(`${dateFormat.YYYYMMDD_UI} 부터`)} ${
          !!eventData.eventEndDate
            ? moment(eventData.eventEndDate).format(
                `${dateFormat.YYYYMMDD_UI} 까지`
              )
            : ''
        }`,
        image: _.get(eventData, 'imgUrlM'),
      };

      return {
        headData,
      };
    } catch (error) {
      return {};
    }
  }

  componentDidMount() {
    const url = document.location.href;
    const id = url.substr(url.lastIndexOf('/') + 1);
    this.props.eventmain.getEventDetail(id);
  }
  render() {
    const { eventmain, headData } = this.props;

    return (
      <>
        <HeadForSEO
          pageName={headData?.pageName || '이벤트'}
          description={headData?.description}
          image={headData?.image}
        />
        <div>
          {eventmain.status.detailPage ? <EventDetail /> : <LoadingPortal />}
        </div>
      </>
    );
  }
}

export default eventdetail;
