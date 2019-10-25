import React from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import Login from 'template/signin/Login';
import Form from '../../stores/form-store/_.forms';
import withAuth from 'components/common/hoc/withAuth';

@withAuth({ isAuthRequired: false })
@observer
class index extends React.Component {
  componentDidMount() {}

  render() {
    Form.signIn.clear();

    return (
      <>
        <Head>
          <title>로그인</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <div>
          <Login form={Form.signIn} />
        </div>
      </>
    );
  }
}

export default withAuth({ isAuthRequired: false })(index);
