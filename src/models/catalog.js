import { catalogList,catalogListTree } from '../services/api';

export default {
  namespace: 'catalog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(catalogList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *tree({ payload,callback }, { call, put }) {
      const response = yield call(catalogListTree, payload);
      yield put({
        type: 'treeData',
        payload: response,
      });
      if (callback) callback(response);
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getresourceclassify, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
    treeData(state, action){
      return {
        ...state,
        treeData: action.payload,
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
