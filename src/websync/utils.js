import { TASK_STATUS } from '@/constants'
import router from '@/router/index.js'
import store from '@/store/index.js'
import { computed } from 'vue'

const user = computed(() => store.state.user.user)
const settings = computed(() => store.state.navigator.navigator.settings)

function isTaskIsSharedForMe (task) {
  return (
    task.emails.includes(user.value.current_user_email) &&
    (task.type === 1 || task.type === 2)
  )
}

function isTaskCompleted (task) {
  return (
    task.status === TASK_STATUS.TASK_COMPLETED ||
    task.status === TASK_STATUS.TASK_CANCELLED ||
    (task.type === 3 &&
      (task.status === TASK_STATUS.TASK_READY ||
        task.status === TASK_STATUS.TASK_REJECTED))
  )
}

export function shouldAddTaskIntoList (task) {
  if (!TaskListChecker.shouldAddCompletedTask(task)) return false
  if (TaskListChecker.ifTaskHasParent(task)) return true

  if (typeof TaskListChecker[router.currentRoute.value.name] === 'function') {
    return TaskListChecker[router.currentRoute.value.name](task)
  }

  return false
}

const TaskListChecker = {
  shouldAddCompletedTask (task) {
    if (isTaskCompleted(task) && !settings.value.show_completed_tasks) {
      return false
    }
    return true
  },
  ifTaskHasParent (task) {
    return (
      task.uid_parent &&
      task.uid_parent !== '00000000-0000-0000-0000-000000000000'
    )
  },
  task (task) {
    return router.currentRoute.value.params.id === task.uid
  },
  search (task) {
    const q = router.currentRoute.value.query.q.toLowerCase()
    const searchingText = (task.name + task.comment).toLowerCase()
    return searchingText.includes(q)
  },
  tasksToday (task) {
    const selectedDate =
      router.currentRoute.value.name === 'tasksToday'
        ? new Date()
        : new Date(router.currentRoute.value.params.date)
    selectedDate.setHours(0, 0, 0, 0)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const isCompleted = isTaskCompleted(task)
    const isCheckExpired = !settings.value.nav_show_overdue

    if (task.date_begin && task.date_begin !== '0001-01-01T00:00:00') {
      const taskDateBegin = new Date(task.date_begin)
      taskDateBegin.setHours(0, 0, 0, 0)
      const taskDateEnd = new Date(task.date_end)
      taskDateEnd.setHours(0, 0, 0, 0)
      const isInPeriod =
        taskDateEnd >= selectedDate && taskDateBegin <= selectedDate
      const isExpired = !isCompleted && taskDateEnd < selectedDate

      // кроме мной порученных задач (их только просроченными отображаем)
      if (task.type !== 2 && isInPeriod) return true

      if (isCheckExpired && selectedDate <= currentDate && isExpired) {
        return true
      }
    } else if (
      task.customer_date_begin &&
      task.customer_date_begin !== '0001-01-01T00:00:00' &&
      (isTaskIsSharedForMe(task) || task.type === 3)
    ) {
      const taskDateBegin = new Date(task.customer_date_begin)
      taskDateBegin.setHours(0, 0, 0, 0)
      const taskDateEnd = new Date(task.customer_date_end)
      taskDateEnd.setHours(0, 0, 0, 0)
      const isInPeriod =
        taskDateEnd >= selectedDate && taskDateBegin <= selectedDate
      const isExpired = !isCompleted && taskDateEnd < selectedDate

      if (isInPeriod) return true

      if (isCheckExpired && selectedDate <= currentDate && isExpired) {
        return true
      }
    }
    return false
  },
  tasksByDate (task) {
    return this.tasksToday(task)
  },
  tasksDelegateByMe (task) {
    if (router.currentRoute.value.params.employee_uid === task.uid_performer) {
      if (
        task.email_performer &&
        task.email_performer !== user.value.current_user_email &&
        task.uid_customer === user.value.current_user_uid
      ) {
        return true
      }
    }
    return false
  },
  tasksDelegateToMe (task) {
    if (router.currentRoute.value.params.employee_uid === task.uid_customer) {
      if (
        task.email_performer &&
        task.email_performer === user.value.current_user_email &&
        task.uid_customer !== user.value.current_user_uid
      ) {
        return true
      }
    }
    return false
  },
  project (task) {
    if (router.currentRoute.value.params.project_id === task.uid_project) {
      if (
        task.uid_project &&
        task.uid_project !== '00000000-0000-0000-0000-000000000000'
      ) {
        return true
      }
    }
    return false
  },
  tasksOverdue (task) {
    if (
      task.email_performer &&
      task.email_performer === user.value.current_user_email &&
      task.is_overdue
    ) {
      return true
    }
    return false
  },
  tasksReady (task) {
    if (
      task.uid_customer === user.value.current_user_uid &&
      task.status === TASK_STATUS.TASK_READY
    ) {
      return true
    }
    return false
  },
  tasksInWork (task) {
    if (
      (task.uid_customer === user.value.current_user_uid ||
        task.uid_performer === user.value.current_user_uid) &&
      task.status === TASK_STATUS.TASK_IN_WORK
    ) {
      return true
    }
    return false
  },
  tasksUnread (task) {
    if (task.readed === 0) {
      return true
    }
    return false
  },
  tasksInFocus (task) {
    if (task.focus === 1) {
      return true
    }
    return false
  },
  taskUnsorted (task) {
    if (
      task.uid_customer === user.value.current_user_uid &&
      task.email_performer === user.value.current_user_email &&
      task.date_begin === '0001-01-01T00:00:00' &&
      task.date_end === '0001-01-01T00:00:00' &&
      task.tags.length === 0 &&
      task.uid_marker === '00000000-0000-0000-0000-000000000000' &&
      task.uid_project === '00000000-0000-0000-0000-000000000000' &&
      task.focus === 0
    ) {
      return true
    }
    return false
  }
}
