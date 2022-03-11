<script setup lang="ts">
import {computed} from "vue";
import {Refresh} from "@element-plus/icons-vue";
import {useApiToolkit, useCounterStore} from "../../store/counter";

const store = useCounterStore()
const apiToolkit = useApiToolkit()

const semesterOptions = computed(() => {
  if (store.period % 2) {
    return [{
      value: 1,
      label: "大一上",
    },
      {
        value: 3,
        label: "大二上",
      },
      {
        value: 5,
        label: "大三上",
      },
      {
        value: 7,
        label: "大四上",
      },
      {
        value: 9,
        label: "研一上",
      },
      {
        value: 11,
        label: "研二上",
      },
    ];
  } else {
    return [{
      value: 2,
      label: "大一下",
    },
      {
        value: 4,
        label: "大二下",
      },
      {
        value: 6,
        label: "大三下",
      },
      {
        value: 8,
        label: "大四下",
      },
      {
        value: 10,
        label: "研一下",
      },
      {
        value: 12,
        label: "研二下",
      },
    ];
  }
});

const handlePeriodChange = (newValue, oldValue) => {
  if (newValue - oldValue === 1 || newValue - oldValue === -1) {
    store.semester += newValue - oldValue;
  } else if ((newValue - oldValue) % 2 !== 0) {
    store.semester += newValue % 2 === 0 ? 1 : -1;
  }
  if (store.semester <= 0 || store.semester > 12) {
    store.semester = 2 - newValue % 2;
  }
};

function pad0(o) {
  return ("" + o).padStart(2, "0");
}

const get_period_display = (period) => {
  if (period) {
    let n1, n2, m1, m2;
    n1 = n2 = parseInt(period / 2, 10) + 7;
    if (period % 2) {
      m1 = 9;
      m2 = 1;
      n2++;
    } else {
      m1 = 2;
      m2 = 7;
    }
    return `20${pad0(n1)}.${pad0(m1)}~20${pad0(n2)}.${pad0(m2)}`;
  } else {
    return "";
  }
};

</script>

<template>
  <div class="GradeSelector">
    <div>
      <el-tooltip class="box-item" effect="dark" content="从2007.9起始的第?学期" placement="bottom">学期戳：</el-tooltip>
      <el-tooltip class="box-item" effect="dark" :content="get_period_display(store.period)" placement="bottom">
        <el-input-number v-model="store.period" :min="29" @change="handlePeriodChange"/>
      </el-tooltip>
    </div>
    <div>
      <el-select v-model="store.semester" class="m-2" placeholder="选择年级">
        <el-option v-for="item in semesterOptions" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div>
      <el-button type="primary" :icon="Refresh" @click="store.addCourseInfoData(undefined, true)">获取数据</el-button>
    </div>
  </div>
</template>

<style scoped>
.GradeSelector {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.GradeSelector div {
  margin: 5px;
}
</style>