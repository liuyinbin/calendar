<template>
  <div class="calendar-box">
    <ul class="calendar-head">
      <li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li>
    </ul>
    <calendarContent ref="calendar_swiper" :checkDate="current_day" @on-change="changeIndex">
      <div v-for="(month,index) in monthList" :key="index" class="month swiper-item">
        <ul v-for="(week,weekindex) in month" :key="weekindex">
          <li v-for="(day,dayindex) in week" @click="chooseDay(day.year,day.month,day.day,day.othermonth,day.mode)">
            <div class="week-day" :class="{ischecked:checkedDay==day.date,othermonth:day.othermonth,istoday:day.istoday}">
              <span style="padding-top:2px;display:block;">
  				    	<i class="day">{{day.day}}</i>
  				    	<i>{{day.nongli.old_str}}</i>
              </span>
              <div class="thing">
                <a :style="{color:thing.color}" v-for="thing in day.thing">{{thing.title}}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </calendarContent>
  </div>
</template>
<script>
  import calendarContent from '../test_canlen/swiper-monthorweek.vue'
  import format from '../test_canlen/format'
  export default{
    data(){
      return{
        disp_date:new Date(),
        today:new Date(),
        current_day:new Date(),
        monthList:[],
        checkedDay:'0000-00-00',
        can_click:true,
      }
    },
    created(){
      this.get3month()
    },
    methods:{
      chooseDay(year,month,day,othermonth,mode){
//        为了PC端点击事件和移动冲突
        if(!this.can_click)return
        this.current_day = new Date(year,month,day)
        this.checkedDay = this.format(year,month,day)
        if(othermonth && mode == 'month'){
          var _tmpdt = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()-othermonth,0)
          var maxday = _tmpdt.getDate()
          var _day = maxday<day?maxday:day
          this.disp_date = new Date(year,month-othermonth,_day)
          this.changeIndex(othermonth,false,true)
        }else if(othermonth && mode == 'week'){
          this.disp_date = this.current_day
        }else{
          this.disp_date = this.current_day
        }
      },
      format(year,month,day){
        month++
        month<10&&(month='0'+month)
        day<10&&(day='0'+day)
        return year + '-' + month + '-' + day;
      },
      getWeek(year,month,day){
        var dt = new Date(year,month,day)
        var weekArr = []
        var dt_first = new Date(year,month,day-((dt.getDay()+6) % 7))
        var week = []
//        console.log(year,month,day)
        for(var j=0;j<7;j++){
          var newdt = new Date(dt_first.getFullYear(),dt_first.getMonth(),dt_first.getDate()+j)
          var _year = newdt.getFullYear()
          var _month = newdt.getMonth()
          var _day = newdt.getDate()
          week.push({
            mode:'week',
            day:_day,
            year:_year,
            month:_month,
            date:this.format(_year,_month,_day),
            nongli:format.solar2lunar(_year,_month+1,_day),
            istoday:(this.today.getFullYear()==_year && this.today.getMonth()==_month && this.today.getDate() == _day)?true:false,
            ischecked:false,
            othermonth:_month!=month
          })
        }
        weekArr.push(week)
        return weekArr
      },
      getMonth(year,month){  //创建单月历
        var monthArr = []
        var dt_first = new Date(year,month,1)   //每个月第一天
        var dt_last = new Date(year,month+1,0)   //每个月最后一天
        var monthLength = dt_last.getDate()-dt_first.getDate()+1
        var daylist =[];
        var space = (dt_first.getDay() - 1 + 7) % 7   //月历前面空格
        //console.log(year,month)
        for(var i = -space;i<36;i+=7){
          var week = []
          for(var j=0;j<7;j++){
            var day = i+j+1
            if(day>0 && day<=monthLength){
              week.push({
                mode:'month',
                day:day,
                year:year,
                month:month,
                date:this.format(year,month,day),
//                日历要显示的其他内容
                thing:(day == 22 || day == 4) ? [{title:'生日',color:'red'},{title:'买蛋糕',color:'yellow'}]:[],
                nongli:format.solar2lunar(year,month+1,day),
                istoday:(this.today.getFullYear()==year && this.today.getMonth()==month && this.today.getDate() == day)?true:false,
                ischecked:false
              })
            }else{
              //其它月份
              //week.push({})
              var newdt = new Date(year,month,day)
              var _year = newdt.getFullYear()
              var _month = newdt.getMonth()
              var _day = newdt.getDate()
              week.push({
                mode:'month',
                day:_day,
                year:_year,
                month:_month,
                date:this.format(year,month,day),
                nongli:format.solar2lunar(_year,_month+1,_day),
                istoday:(this.today.getFullYear()==_year && this.today.getMonth()==_month && this.today.getDate() == _day)?true:false,
                ischecked:false,
                othermonth:day<=0?-1:1,
              })
            }
          }
          monthArr.push(week)
        }
        return monthArr
      },
      get3month(){
        var year = this.disp_date.getFullYear()
        var month = this.disp_date.getMonth()
        this.monthList = []
        this.monthList.push(this.getMonth(year,month-1))
        this.monthList.push(this.getMonth(year,month))
        this.monthList.push(this.getMonth(year,month+1))
      },
      get3week(){
        var year = this.disp_date.getFullYear()
        var month = this.disp_date.getMonth()
        var day = this.disp_date.getDate()
        this.monthList = []
        this.monthList.push(this.getWeek(year,month,day-7))
        this.monthList.push(this.getWeek(year,month,day))
        this.monthList.push(this.getWeek(year,month,day+7))
        console.log(this.monthList)
      },
      changeIndex(index,is_week,is_click = false){
        if(index){
          if(is_week){
            this.disp_date = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth(),this.disp_date.getDate()+(7*(index)))
            this.checkedDay = this.format(this.disp_date.getFullYear(), this.disp_date.getMonth(), this.disp_date.getDate())
            this.current_day = this.disp_date
            this.get3week()
          }else{
//            console.log(this.disp_date.getMonth()+index)
            var _tmpdt = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()+index,0)
            var maxday = _tmpdt.getDate()
            var _day = maxday<this.disp_date.getDate()?maxday:this.disp_date.getDate()
            console.log(_day)

            this.disp_date = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()+index,_day)
            if(!is_click){
              this.checkedDay = this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),this.disp_date.getDate())
              console.log(this.checkedDay)
            }
//            console.log(this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),_day))
            this.get3month()

            console.log('move_change')
          }
          this.$refs.calendar_swiper.move_change()
        }
      }
    },
    components:{
      calendarContent
    }
  }
</script>
<style scoped>
  .calendar-box{
    /*background: #4188d8;*/
    color: #fff;
    position: relative;
    height:100%;
    z-index:99;
  }
  .calendar-head{
    background: #4188d8;
    display: flex;
    height:30px;
    line-height: 30px;
  }
  .calendar-head li{
    flex-grow: 1;
    text-align: center;
  }
  .swiper-item{
    position: absolute;
    width:100%;
    height:100%;
    top:0;
  }
  .swiper-item:nth-child(1){
    left: -100%;
  }
  .swiper-item:nth-child(2){
    left:0;
  }
  .swiper-item:nth-child(3){
    left: 100%;
  }
  .month ul{
    display:flex;
    margin:0;
    padding:0;
    width: 100%;
    height:16%;
    min-height:40px;
    border-right:1px solid #eee;
  }
  .month li{
    flex: 1;
    flex-grow: 1;
    overflow: hidden;
  }
  .week-day{
    position: relative;
    margin: auto;
    font-size:12px;
    text-align: center;
    border: 0;
    line-height: 10px;
    overflow: hidden;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    z-index: 1;
    height:140px;
  }
  .week-day i{
    display:block;
    text-align: center;
    font-size: 10px;
    font-style:normal;
    padding:1px;
    line-height: 14px;
    height:14px;
  }
  .thing a {
    cursor: pointer;
    display: block;
    width: 100%;
    overflow: hidden;
    word-break: break-all;
    line-height: 16px;
    height: 16px;
  }
  .thing{
    margin-top: 3px;
  }
  .othermonth{
    color: #dcafaf;
  }
  .istoday{
    background: #06c7f3!important;
  }
  .ischecked{
    background-color: #f17117!important;
  }
</style>
