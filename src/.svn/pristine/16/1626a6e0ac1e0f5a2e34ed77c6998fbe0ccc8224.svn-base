<template>
  <el-card id="history-grid" class="box-card">
    <div slot="header" class="clearfix">
      <span>Lịch sử</span>
    </div>
    <div class="el-table__body-wrapper is-scroll-left">
      <table style="width: 100%">
        <thead class="positive-bg light text-bold">
        <tr>
          <th v-for="h in dtHeader">{{h}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="itemLog in dtSource" :style="{'background-color': itemLog.type=='body'? '#e4e5e6' : '#fff'}">
          <td v-if="itemLog.type=='head'" class="success" colspan="3">
            v.{{itemLog.value.Version + '.0 '}}<strong>{{itemLog.value.CreatedByName}}</strong>, {{$Utils.formatDateTime(itemLog.value.Created,'DD-MM-YYYY HH:mm')}}
          </td>
          <td v-if="itemLog.type =='body'" >{{itemLog.value.ColumnCaption}}</td>
          <td v-if="itemLog.type =='body'">{{itemLog.value.OldDisplayValue}}</td>
          <td v-if="itemLog.type =='body'">{{itemLog.value.NewDisplayValue}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>
<script>
  export default {
    props: ["dtSource","dtHeader"],
    methods: {
    },
    data() {
      return {
      };
    }
  }
</script>
<style lang="scss">
  #history-grid {
    th {
      text-align: center !important;
      border: solid thin lightgray;
    }
    tr, td {
      border : solid thin lightgray;
    }
  }
</style>
