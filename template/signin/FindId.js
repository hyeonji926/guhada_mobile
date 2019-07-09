import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import {
  LoginWrapper,
  LoginCheckBox,
  LoginInput,
  LoginButton,
} from 'components/login';
import css from './FindId.module.scss';
import FindLoginInfoHeader from 'components/login/FindLoginInfoHeader';
import LoginRadio from 'components/login/LoginRadio';
import { observer, inject } from 'mobx-react';
import FindIdMyInfo from 'components/login/findid/FindIdMyInfo';
import FindMobileAuth from 'components/login/FindMobileAuth';

@inject('authmobile')
@observer
export class FindId extends Component {
  state = {
    radioChecked: 'findInfo',
  };

  onChangeRadio = value => {
    this.setState({
      radioChecked: value,
    });
  };

  render() {
    const { form, authmobile } = this.props;

    let value = form.get('value');
    // console.log('value', value);
    return (
      <DefaultLayout pageTitle={'아이디/비밀번호 찾기'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <FindLoginInfoHeader select={'FindId'} />
          </div>
          <div className={css.radioWrap}>
            <LoginRadio
              field={form.$('findId')}
              label={'내 회원정보로 찾기'}
              value={'findInfo'}
              checked={this.state.radioChecked}
              onChangeRadio={this.onChangeRadio}
            />
            {this.state.radioChecked === 'findInfo' ? (
              <FindIdMyInfo form={form} />
            ) : null}
          </div>
          <div className={css.radioWrap}>
            <LoginRadio
              field={form.$('findId')}
              label={'휴대폰 본인인증으로 찾기'}
              value={'findMobile'}
              checked={this.state.radioChecked}
              onChangeRadio={this.onChangeRadio}
            />
            {this.state.radioChecked === 'findMobile' ? (
              <FindMobileAuth authmobile={authmobile} />
            ) : null}
          </div>
          <form name="form_chk" method="post" style={{ display: 'none' }}>
            <input type="hidden" name="m" value="checkplusSerivce" />
            <input type="hidden" name="EncodeData" value={authmobile.authKey} />
          </form>
        </LoginWrapper>
      </DefaultLayout>
    );
  }
}

export default FindId;