import { constants } from './index';
import axios from 'axios';
import { fromJS } from 'immutable';


const changeList = (data) => ({
	type: constants.CHANGE_LIST,
	data: fromJS(data),
	totalPage: Math.ceil(data.length / 10)
});

export const setInputFocus = () => ({
	type: constants.SET_INPUT_FOCUS
});

export const setInputBlur = () => ({
	type: constants.SET_INPUT_BLUR
});

export const mouseEnter = () => ({
	type: constants.MOUSE_ENTER
});

export const mouseLeave = () => ({
	type: constants.MOUSE_LEAVE
});

export const changePage = (page) => ({
	type: constants.CHANGE_PAGE,
	page
});

export const getList = () => {
	return (dispatch) => {
		axios.get('/api/headerList.json').then((res) => {
			const result = res.data;
			dispatch(changeList(result.data));
		}).catch((error) => {
			console.log(error);
		})
	}
};