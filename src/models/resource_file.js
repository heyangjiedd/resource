import { resourcefileLista, downloadfile} from '../services/api';

export default {
  namespace: 'resource_file',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //取数据源列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(resourcefileLista, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getresourceclassify, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    *downloadfile({ payload }, { call, put }) {
      const response = yield call(downloadfile, payload);
      // yield put({
      //   type: 'get',
      //   payload: response,
      // });
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
    get(state, action){
      return {
        ...state,
        treeData: action.payload,
      };
    }
  },
};
