import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { actionCreators }  from './store';
import { actionCreators as LoginActionCreators } from '../../pages/login/store';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import {
	HeaderWrapper,
	Logo,
	Nav,
	NavItem,
	NavSearch,
	Addition,
	Button,
	SearchWrapper,
	SearchInfo,
	SearchInfoTitle,
	SearchInfoSwitch,
	SearchInfoItem,
	SearchInfoList
} from './style';

class Header extends PureComponent{

	getListArea = () => {
		const {  totalPage, focused, list, page, handleMouseEnter, handleMouseLeave, mouseIn, handleChangePage } = this.props;
		const pageList = [];
		const newList = list.toJS();
		for(let i = (page - 1) * 10; i < page * 10; i++) {
			if (newList[i] !== undefined){
				pageList.push(
					<SearchInfoItem key={newList[i]}>{newList[i]}</SearchInfoItem>
				);
			}
		}

		if (focused || mouseIn) {
			return (
				<SearchInfo 
				  onMouseEnter={ handleMouseEnter }
					onMouseLeave={ handleMouseLeave }
				>
					<SearchInfoTitle>
						热门搜索
						<SearchInfoSwitch onClick={() => handleChangePage(page, totalPage, this.spinIcon)}>
							<i ref={(icon) => {this.spinIcon = icon}} className='iconfont spin'>&#xe606;</i>
							换一批
						</SearchInfoSwitch>
					</SearchInfoTitle>
					<SearchInfoList>
					  {pageList}
					</SearchInfoList>
				</SearchInfo>
			)
		} else {
			return null;
		}
	};
	render() {
		const { focused, handleInputFocus, handleInputBlur, list, login, logout } = this.props;
		return (
			<HeaderWrapper>
				<Link to='/'>
					<Logo></Logo>
				</Link>
				<Nav>
					<NavItem className='left active'>首页</NavItem>
					<NavItem className='left'>下载</NavItem>
					{
						login ? 
							<NavItem className='right' onClick={logout}>退出</NavItem>: 
							<Link to='/login'>
								<NavItem className='right'>登录</NavItem>
							</Link>
					}
					<NavItem className='right'>
						<i className='iconfont'>&#xe636;</i>
					</NavItem>
					<SearchWrapper>
						<CSSTransition
							in={this.props.focused}
							timeout={1000}
							classNames='slide'
						>
							<NavSearch
								className={focused ? 'focused' : ''}
								onFocus={() => handleInputFocus(list)}
								onBlur={handleInputBlur}
							></NavSearch>
						</CSSTransition>
						<i className={ focused ? 'focused iconfont zoom' : 'iconfont zoom'}>&#xe624;</i>
						{this.getListArea()}
					</SearchWrapper>
					<Addition>
						<Link to='/write'>
							<Button className='writing'>
								<i className='iconfont'>&#xe615;</i>
								写文章
							</Button>
						</Link>
						<Button className='reg'>注册</Button>
					</Addition>
				</Nav>
			</HeaderWrapper>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		focused: state.getIn(['header', 'focused']),
		list: state.getIn(['header','list']),
		page: state.getIn(['header', 'page']),
		mouseIn: state.getIn(['header', 'mouseIn']),
		totalPage: state.getIn(['header', 'totalPage']),
		login: state.getIn(['login', 'login'])
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleInputBlur() {
			const action = actionCreators.setInputBlur();
			dispatch(action);
		},
		handleInputFocus(list) {
			if (list.size === 0) {
				dispatch(actionCreators.getList());
			}
			dispatch(actionCreators.setInputFocus());
		},
		handleMouseEnter() {
			dispatch(actionCreators.mouseEnter());
		},
		handleMouseLeave() {
			dispatch(actionCreators.mouseLeave());
		},
		handleChangePage(page, totalPage, spin) {
			let oldAngle = spin.style.transform.replace(/[^0-9]/gi, '');
			if(oldAngle) {
				oldAngle = parseInt(oldAngle, 10);
			}else {
				oldAngle = 0;
			}
			spin.style.transform = `rotate(`+ (oldAngle+360) +`deg)`;
			if(page < totalPage){
				dispatch(actionCreators.changePage(page + 1))
			}else {
				dispatch(actionCreators.changePage(1));
			}
		},
		logout() {
			dispatch(LoginActionCreators.logout());
		}
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Header);
