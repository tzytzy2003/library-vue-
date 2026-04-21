<template>
  <el-main>
    <div id="title">
      数据统计
    </div>
    <hr>
    <div style="display: flex">
      <div id="main2" style="width: 395px; height: 300px; flex-grow: 1"></div>
      <div id="main1" style="width: 395px; height: 300px; flex-grow: 1"></div>
    </div>

    <!-- 管理员统计 -->
    <el-row :gutter="20" type="flex" class="row-bg" justify="center" style="margin-bottom: 80px">
      <el-col :span="6">
        <div class="show-header" style="background: rgb(0,191,255)">
          <div class="show-num">{{ readerCount }}</div>
          <div class="bottom-text"> 读者总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(100,149,237)">
          <div class="show-num">{{ applyReader }}</div>
          <div class="bottom-text"> 读者待审核</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(60,179,113)">
          <div class="show-num">{{ borrowApplyCount }}</div>
          <div class="bottom-text"> 借书待审核</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(237, 64, 20)">
          <div class="show-num">{{ borrowReturnCount }}</div>
          <div class="bottom-text"> 到期待还书</div>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card" style="margin-top: 30px">
      <div slot="header" class="announcement">
        <span style="color: #000000; font-weight: 600"> 公告列表</span>
      </div>
      <div v-for="o in noticeList" :key="o.noticeId" class="text item">
        <span style="font-weight:600;font-size:14px;">{{ o.noticeTitle }}</span><span
          style="margin-left:30px;font-size:14px">{{ o.noticeContent }}</span>
        <el-divider></el-divider>
      </div>
    </el-card>
  </el-main>
</template>

<script>
import { getUserType, getUserId } from '@/utils/auth'
import { getReaderCountApi, getApplyReaderCountApi } from '@/api/reader'
import { getBorrowApplyCountApi, getBorrowReturnCountApi } from '@/api/borrow'
import { categoryCountApi } from '@/api/category'
import { getHotBookApi } from '@/api/book'
import { getTopListApi } from '@/api/notice'
import { getListApi } from '@/api/role'

export default {
  name: 'Dashboard',
  data() {
    return {
      readerCount: 0,
      applyReader: 0,
      borrowApplyCount: 0,
      borrowReturnCount: 0,
      noticeList: [],
      roleType: '',
      tableData: [],
      // 角色Id
      roleId: ''
    }
  },
  mounted() {
    this.myechert1()
    this.myechert2()
    this.getReaderCount()
    this.getApplyReaderCount()
    this.getBorrowApplyCount()
    this.getBorrowReturnCount()
    this.getNoticeList()
  },
  methods: {
    async getNoticeList() {
      let res = await getTopListApi()
      if (res && res.code == 200) {
        console.log('公告列表')
        console.log(res)
        this.noticeList = res.data
      }
    },
    async getBorrowReturnCount() {
      let res = await getBorrowReturnCountApi({
        userType: getUserType(),
        userId: getUserId()
      })
      console.log(res)
      if (res && res.code == 200) {
        this.borrowReturnCount = res.data
      }
    },
    async getBorrowApplyCount() {
      let res = await getBorrowApplyCountApi({
        userType: getUserType(),
        userId: getUserId()
      })
      console.log(res)
      if (res && res.code == 200) {
        this.borrowApplyCount = res.data
      }
    },
    async getReaderCount() {
      let res = await getReaderCountApi()
      console.log(res)
      if (res && res.code == 200) {
        this.readerCount = res.data
      }
    },
    async getApplyReaderCount() {
      let res = await getApplyReaderCountApi()
      console.log(res)
      if (res && res.code == 200) {
        this.applyReader = res.data
      }
    },
    async myechert1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main1'))

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '图书分类统计'
        },
        xAxis: {
          data: [],
          axisLabel: {
            //x轴文字的配置
            show: true,
            interval: 0,//使x轴文字显示全
            formatter: function (params) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 3; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: '数量',
            type: 'bar',
            data: []
          }
        ]
      }
      // 动态获取数据
      let res = await categoryCountApi()
      if (res && res.code == 200) {
        console.log('分类数据')
        console.log(res)
        option.xAxis.data = res.data.names
        option.series[0].data = res.data.counts
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async myechert2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main2'))

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '热门图书排行榜',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '借阅次数',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 动态获取数据
      let res = await getHotBookApi()
      if (res && res.code == 200) {
        console.log('热门图书')
        console.log(res)
        option.series[0].data = res.data
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    // 获取列表
    async getList() {
      const res = await getListApi(this.listParm)
      if (res && res.code == 200) {
        console.log(res)
        // 设置表格数据
        this.tableData = res.data.records
        this.listParm.total = res.data.total
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-text {
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  text-align: center;
  position: absolute;
  padding: 10px;
}

#title {
  height: 50px;
  font-size: 30px
}

.show-header {
  background: #00c0ef;
  color: #fff;
  height: 200px;
  border-radius: 5px;
  position: relative;
}

.show-num {
  font-size: 60px;
  font-weight: 600;
  padding: 40px 0 0 0;
  text-align: center;
}
</style>
