import { resourcelist,resourcelink} from '../services/api';

export default {
  namespace: 'centersource',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData:[]
  },

  effects: {
    //取数据源列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(resourcelist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(resourcelist, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    *test({ payload, callback }, { call, put }) {
      const response = yield call(resourcelink, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(resourcelist, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(resourcelist, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(resourcelist, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    get(state, action){
      return {
        ...state,
        treeData: action.payload,
      };
    }
  },
};
