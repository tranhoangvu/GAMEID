import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import {Form, Icon} from 'native-base';
import Spinner from '../../lib/Spinner';
import firebase from 'react-native-firebase';
import CountryPicker from 'react-native-country-picker-modal';
import {updatePhoneNumber} from '../../index';

export default class PhoneVerification extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneInput: '',
      phoneNumber: '',
      confirmResult: null,
      phoneAuthSnapshot: null,
      enterCode: false,
      spinner: false,
      country: {
        cca2: 'VN',
        callingCode: '84'
      }
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '',
          confirmResult: null,
          phoneAuthSnapshot: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  _onChangeText = (val) => {
    if (val.length) {
      this.setState({ phoneInput: val })
    }
    if (!this.state.enterCode) return;
    if (val.length === MAX_LENGTH_CODE){
      this.setState({ codeInput: val })
      this._verifyCode();
    }
  }

  _tryAgain = () => {
    this.refs.textInput.setNativeProps({
      text: ''
    })
    this.refs.textInput.focus();
    this.setState({
      enterCode: false
    });
  }

  _getCode = () => {
    var phoneInput = this.state.phoneInput;
    if (phoneInput.length >= 9) {
      if (phoneInput.substr(0, 1) === '0') phoneInput = phoneInput.substring(1, phoneInput.length);
      // console.log(phoneInput);
      // console.log(phoneInput.substr(0, 1));
      // console.log(phoneInput.substring(1, phoneInput.length));
      this.setState({
        spinner: true,
        phoneNumber: "+" + this.state.country.callingCode + phoneInput,
      });
      // console.log(this.state.phoneInput);
      setTimeout(async () => {
        try {
          // console.log(this.state.phoneNumber);
          firebase.auth()
            .verifyPhoneNumber(this.state.phoneNumber)
            .on('state_changed', (phoneAuthSnapshot) => {
              switch (phoneAuthSnapshot.state) {
                case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                  console.log('code sent');
                  break;
                case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                  console.log('verification error');
                  console.log(phoneAuthSnapshot.error);
                  break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                  console.log('auto verify on android timed out');
                  break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                  console.log('auto verified on android');
                  console.log(phoneAuthSnapshot);
                  const {
                    verificationId,
                    code
                  } = phoneAuthSnapshot;
                  const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                  firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
                    .then((user) => {
                      this.setState({
                        spinner: false
                      });
                      setTimeout(() => {
                        // Alert.alert('Thành công!', 'Số điện thoại của bạn đã được xác thực!');
                        Alert.alert(
                          'Thành công!',
                          'Số điện thoại của bạn đã được xác thực!', [{
                            text: 'OK',
                            onPress: () => this.props.navigation.goBack()
                          }]
                        )
                      }, 100);
                    })
                    .catch((error) => {
                      console.log(error.message)
                      this.setState({
                        spinner: false
                      });
                      setTimeout(() => {
                        Alert.alert('Lỗi!', 'Vui lòng thử lại!');
                      }, 100);
                      updatePhoneNumber();
                    });
                  break;
              }
            }, (error) => {
              console.log(error);
              console.log(error.verificationId);
              console.log(error.message);
              this.setState({
                spinner: false
              });
              setTimeout(() => {
                Alert.alert('Lỗi!', 'Vui lòng thử lại!');
              }, 100);
            }, (phoneAuthSnapshot) => {
                this.setState({
                  phoneAuthSnapshot,
                  spinner: false,
                  enterCode: true,
                });
                setTimeout(() => {
                  Alert.alert('Mã đã gửi!', "Bạn sẽ nhận được mã xác thực qua SMS", [{
                    text: 'OK',
                    onPress: () => this.refs.textInput.focus()
                  }]);
                }, 100);
            });
          this.refs.textInput.setNativeProps({ text: '' });
        } catch (err) {
          console.log(err.message);
          this.setState({ spinner: false });
          setTimeout(() => {
            Alert.alert('Lỗi!', 'Vui lòng thử lại!');
          }, 100);
        }
      }, 100);
    }else{
      Alert.alert('Lỗi!', "Số điện thoại không hợp lệ, vui lòng nhập lại!", [{
        text: 'OK',
        onPress: () => this.refs.textInput.focus()
      }])
    }
  }

  _verifyCode = () => {
    this.setState({ spinner: true });
    setTimeout(async () => {
      try {
        const { codeInput, phoneAuthSnapshot } = this.state;
        // console.log(phoneAuthSnapshot);
        // console.log(codeInput);
        if (phoneAuthSnapshot && codeInput.length) {
            const { verificationId } = phoneAuthSnapshot;
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, codeInput);
            // console.log(credential);
            firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
                .then((user) => {
                    this.setState({
                      spinner: false
                    });
                    updatePhoneNumber();
                    setTimeout(() => {
                      // Alert.alert('Thành công!', 'Số điện thoại của bạn đã được xác thực!');
                      Alert.alert(
                        'Thành công!',
                        'Số điện thoại của bạn đã được xác thực!', [{
                            text: 'OK',
                            onPress: () => this.props.navigation.goBack()
                          }
                        ]
                      )
                    }, 100);
                })
                .catch((error) => {
                  console.log(error.message);
                  this.setState({
                    spinner: false
                  });
                  setTimeout(() => {
                    Alert.alert('Lỗi!', 'Vui lòng thử code lại hoặc dùng số điện thoại khác!');
                  }, 100);
              });
          }
      } catch (err) {
        console.log(err.message);
        this.setState({ spinner: false });
        setTimeout(() => {
          Alert.alert('Lỗi!', 'Vui lòng thử lại hoặc dùng số điện thoại khác!');
        }, 100);
      }
    }, 100);
  }

  _getSubmitAction = () => {
    this.state.enterCode ? this._verifyCode() : this._getCode();
  }

  _changeCountry = (country) => {
    this.setState({
      country
    });
    this.refs.textInput.focus();
  }

  _renderCountryPicker = () => {
    if (this.state.enterCode)
      return (
        <View />
      );
    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation = 'vn' />
        // translation='eng' />
    );
  }

  _renderCallingCode = () => {
    if (this.state.enterCode)
      return (
        <View />
      );
    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );
  }

  _renderFooter = () => {
    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Bạn muốn nhập lại số điện thoại và nhận mã kích hoạt, nhấn vào đây!.
          </Text>
        </View>
      );
    return (
      <View>
        <Text style={styles.disclaimerText}>Nhấn vào "Gửi mã xác thực" bên trên để nhận được mã kích hoạt xác thực số điện thoại qua tin nhắn SMS. Mỗi tài khoản chỉ kích hoạt một số điện thoại và không thể thay đổi. Vui lòng chắc chắn!</Text>
      </View>
    );
  }

  render() {
    let headerText = `${this.state.enterCode ? 'Nhập mã xác thực' : 'Nhập số điện thoại'} của bạn?`
    let buttonText = this.state.enterCode ? 'Xác thực' : 'Gửi mã xác thực';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};
    return (
      <View style={styles.container}>
      <View style={[styles.closeView, {zIndex: 999}]}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="close-circle" style={{ color: '#001eff' }} />
          </TouchableOpacity>
      </View>
        <Text style={styles.header}>{headerText}</Text>
        <Form ref={'form'} style={styles.form}>
          <View style={{ flexDirection: 'row' }}>
            {this._renderCountryPicker()}
            {this._renderCallingCode()}
            <TextInput
              ref={'textInput'}
              name={this.state.enterCode ? 'code' : 'phoneNumber'}
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={this._onChangeText}
              placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Số điện thoại'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[styles.textInput, textStyle]}
              returnKeyType='go'
              autoFocus
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={this.state.enterCode ? 6 : 20}
              onSubmitEditing={this._getSubmitAction} />
          </View>
          <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
          {this._renderFooter()}
        </Form>
        <Spinner
          visible={this.state.spinner}
          textContent={'Vui lòng đợi...'}
          textStyle={{ color: '#fff' }} />
      </View>
    );
  }
}

const MAX_LENGTH_CODE = 6;

const MAX_LENGTH_NUMBER = 20;

const countryPickerCustomStyles = {};

const brandColor = '#744BAC';

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  },
  closeView: {
    marginTop: Platform.OS === "android" ? 5 : 15,
    margin: 6,
    alignItems: 'flex-end',
  },
});