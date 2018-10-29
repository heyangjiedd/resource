import {
  catalogList, catalogListTree, querycatalogItem, tableField, itemField,operateLogApi,
  catalogApi, catalogCollection, catalogFile, catalogTableAndTableField,catalogTable,sourceTableField,
} from '../services/api';

export default {
  namespace: 'catalog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData: [],
    catalogItem: [],
    field: [],
    selectedFields:[], /* 当前已经选中的字段 */
    selectedFieldsCount:0,
    tableAndField: [{
      sourceTable:{},
      tableFieldList:[],
    }],
    logdata:{
      list: [],
      pagination: {},
    },
    catTable:[],
    sourceTableField:[],

    selDataSource:[], /* 选择的数据源 */
    selDataSourceIds:[], /* 选择的数据源 */
    currentTable:{}, /* 当前选中的表 */
    curSelectedRowKeys:[], /* 当前表选中的字段 */

    relationships:[], /* 表间关系 */
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(catalogList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * tree({ payload, callback }, { call, put }) {
      const response = yield call(catalogListTree, payload);
      yield put({
        type: 'treeData',
        payload: response,
      });
      if (callback) callback(response);
    },
    * querycatalogItem({ payload }, { call, put }) {
      const response = yield call(querycatalogItem, payload);
      yield put({
        type: 'catalogItem',
        payload: response,
      });
    },
    * sourceTable({ payload }, { call, put }){
      const response = yield call(sourceTableField, payload);
      yield put({
        type: 'sourceTablePut',
        payload: response,
      });
    },
    * tableField({ payload,callback }, { call, put }) {
      const response = yield call(tableField, payload);
      yield put({
        type: 'field',
        payload: response,
      });
      if (callback) callback(response);
    },
    * operateLog({ payload }, { call, put }) {
      const response = yield call(operateLogApi, payload);
      yield put({
        type: 'log',
        payload: response,
      });
    },
    * get({ payload }, { call, put }) {
      const response = yield call(getresourceclassify, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(itemField, payload);
      if (callback) callback();
    },
    * catalogApi({ payload, callback }, { call, put }) {
      const response = yield call(catalogApi, payload);
      if (callback) callback();
    },
    * catalogCollection({ payload, callback }, { call, put }) {
      const response = yield call(catalogCollection, payload);
      if (callback) callback();
    },
    * catalogFile({ payload, callback }, { call, put }) {
      const response = yield call(catalogFile, payload);
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * querycatalogItemCopy({ payload, callback }, { call, put }) {
      yield put({
        type: 'catalogItemCopy',
        payload,
      });
    },
    * catalogTableAndTableField({ payload, callback }, { call, put }) {
      const response = yield call(catalogTableAndTableField, payload);
      yield put({
        type: 'tablefield',
        payload: response,
      });
    },
    * catalogTable({ payload, callback }, { call, put }) {
      const response = yield call(catalogTable, payload);
      yield put({
        type: 'catTable',
        payload: response,
      });
    },
  },

  reducers: {
    sourceTablePut(state, action) {
      return {
        ...state,
        sourceTableField: action.payload,
      };
    },
    catTable(state, action) {
      return {
        ...state,
        catTable: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    log(state, action) {
      return {
        ...state,
        logdata: action.payload,
      };
    },
    catalogItem(state, action) {
      return {
        ...state,
        catalogItem: action.payload,
      };
    },
    tablefield(state, action) {
      return {
        ...state,
        tableAndField: action.payload,
      };
    },
    catalogItemCopy(state, action) {
      return {
        ...state,
        catalogItem: action.payload,
      };
    },
    field(state, action) {
      // 判断是否已经被选中
      // console.log( action );
      // console.log( state.selectedFields );
      const newFields = action.payload.map(item=>{
        const item0 = item;
        item0.checked = false;
        const id = item.id;
        const tableId = item.tableId;
        if( state.selectedFields[tableId] ) {
          const existed = state.selectedFields[tableId].some((item1) => {
            return item1.id===id // 结果为true
          });
          if( existed ) {
            item0.checked = true;
          }
        }
        return item0;
      });

      // console.log( newFields );

      return {
        ...state,
        field: newFields,
      };
    },
    selectField(state, action) {
      let selectedFields = state.selectedFields;
      const tableId = state.currentTable.id;
      selectedFields[tableId] = [];
      selectedFields[tableId] = action.payload;


      // console.log( Object.keys(selectedFields) );
      let selectedFieldsCount = 0;
      selectedFields.map(item=>{
        item.map(item0=>{
          selectedFieldsCount++;
        });
      });
      return {
        ...state,
        selectedFields: selectedFields,
        selectedFieldsCount: selectedFieldsCount,
      };
    },
    clearSelect(state, action) {
      return {
        ...state,
        selectedFields: [],
        selectedFieldsCount: 0,
        selDataSource: [],
        selDataSourceIds: [],
        currentTable: {},
        curSelectedRowKeys: [],
      };
    },
    saveCurrentTable(state, action) {
      let tableId = action.payload.id;
      let selectedFields = state.selectedFields;
      // console.log(action);
      // console.log(action.payload);
      // console.log(tableId);
      let curSelectedRowKeys = [];
      if( selectedFields[tableId] ) {
        // console.log(selectedFields[tableId]);
          curSelectedRowKeys = selectedFields[tableId].map(item => {
          return item.id;
        });
      }

      // console.log( curSelectedRowKeys );
      return {
        ...state,
        currentTable: action.payload,
        curSelectedRowKeys: curSelectedRowKeys,
      };
    },
    treeData(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
    get(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },

    addRelationShip(state, action) {
      let relationships = state.relationships;
      relationships.push( action.payload );

      console.log(relationships);
      return {
        ...state,
        relationships: relationships,
      };
    },

    delRelationShip(state, action) {
      console.log(action.payload);
      let keys = action.payload;
      console.log(keys);
      let relationships = state.relationships.filter(item => {
        let check = keys.some(item0=>{
          return item0 == item.key;
        });
        return !check;
      });
      console.log( relationships );
      // let relationships = state.relationships;
      return {
        ...state,
        relationships: relationships,
      };
    },

    setSelDataSource(state, action) {
      const selDataSourceIds = action.payload.map(item=>{
        return item.id;
      });

      // console.log( "setSelDataSource=" );
      // console.log( selDataSourceIds );
      return {
        ...state,
        selDataSource: action.payload,
        selDataSourceIds,
      };
    },
  },
};
