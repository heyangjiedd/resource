import { resourceclassifyList,getresourceclassify,addresourceclassify,updateresourceclassify,removeresourceclassify,getAllresourceclassify} from '../services/api';

export default {
  namespace: 'classify',

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
      const response = yield call(resourceclassifyList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *tree({ payload ,callback}, { call, put }) {
      const response = yield call(getAllresourceclassify, payload);
      yield put({
        type: 'treeDate',
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
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeresourceclassify, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateresourceclassify, payload);
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
    treeDate(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
    get(state, action){
      return {
        ...state,
        detail: action.payload,
      };
    }
  },
};
