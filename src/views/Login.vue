<template>
  <FullScreenSection
    v-slot="{ cardClass, cardRounded }"
    bg="leadertask"
  >
    <img
      src="https://www.leadertask.ru/templates/default/img/logo.svg"
      class="mb-10"
    >
    <CardComponent
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <Icon
        v-if="form.showBackButton"
        :path="mdiChevronLeft"
        class="cursor-pointer"
        size="24"
        :box="'0 0 24 24'"
        @click="getBack"
      />
      <p class="pb-4 pt-5 text-center text-2xl font-bold dark:text-white">
        {{ form.startScreenText }}
      </p>
      <Field>
        <Control
          v-model="form.email"
          :icon="form.emailMdi"
          name="email"
          :icon-class="form.emailIconClass"
          placeholder="Email"
          autocomplete="email"
          type="email"
          required
          :disabled="form.emailControlDisabled"
          :is-valid="form.isEmailValid"
          @blur="checkEmailExistense"
          @keyup.enter="checkEmailExistense"
        />
      </Field>
      <p
        v-if="form.emailShowError"
        class="text-red-500 text-xs pb-3"
      >
        {{ form.emailErrorMessage }}
      </p>
      <jb-button
        v-if="form.showCheckButton"
        class="w-full rounded-lg text-sm"
        color="login"
        :icon="mdiArrowRight"
        label="Продолжить с Email"
        @click="checkEmailExistense"
      />
      <div
        class="mt-2 w-full"
      >
        <GoogleLogin
          v-if="form.showCheckButton"
          class="w-full"
          :callback="googleCallback"
          popup-type="TOKEN"
        >
          <jb-button
            class="w-full rounded-lg text-sm"
            color="white"
            :icon="'google'"
            label="Войти через Google"
          />
        </GoogleLogin>
      </div>
      <transition-group name="slide-fade">
        <div v-if="showValues.showLoginInputsValue">
          <Field>
            <Control
              v-model="form.password"
              name="password"
              autocomplete="current-password"
              placeholder="Пароль"
              icon-class="cursor-pointer"
              :show="showValues.showLoginInputsValue"
              :icon="form.showPassword ? mdiEyeOutline : mdiEyeOffOutline"
              :type="form.showPassword ? 'text' : 'password'"
              :valid="form.password.trim().length > 7"
              @icon-click="togglePasswordVisibility"
            />
          </Field>
          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>
          <jb-button
            type="submit"
            class="w-full rounded-lg text-sm"
            color="login"
            :icon="mdiArrowRight"
            label="Войти"
          />
          <a
            href="https://www.leadertask.ru/user?t=passrecovery"
            class="text-xs mt-5 text-blue-500 underline decoration-1"
            target="_blank"
          >
            Забыли пароль?
          </a>
        </div>
      </transition-group>

      <transition-group name="slide-fade">
        <div v-if="showValues.showRegisterInputsValue">
          <Field
            help="Пароль (не менее 8 символов)"
            :max-count="8"
            :actual-count="form.password.length"
          >
            <Control
              v-model="form.password"
              name="password"
              placeholder="Пароль"
              autocomplete="current-password"
              icon-class="cursor-pointer"
              :show="showValues.showRegisterInputsValue"
              :icon="form.showPassword ? mdiEyeOutline : mdiEyeOffOutline"
              :type="form.showPassword ? 'text' : 'password'"
              :valid="validatePassword"
              @icon-click="togglePasswordVisibility"
              @click="form.passwordTouched = true"
              @blur="validateAndShowMessage"
            />
          </Field>

          <Field
            help="Введите ваше имя"
            :max-count="3"
            :actual-count="form.username.length"
          >
            <Control
              v-model="form.username"
              type="text"
              :maxlength="'50'"
              :icon="mdiAccountOutline"
              name="username"
              autocomplete="username"
              placeholder="Имя пользователя"
              :valid="validateName"
              @click="form.usernameTouched = true"
              @blur="validateAndShowMessage"
            />
          </Field>

          <Field
            help="Введите ваш номер телефона"
          >
            <Control
              v-model="form.phone"
              v-maska="'+7 (###) ###-##-##'"
              type="text"
              :icon="mdiPhoneOutline"
              :valid="validatePhone"
              name="phone"
              autocomplete="phone"
              placeholder="Номер телефона"
              @click="form.phoneTouched = true"
              @blur="validateAndShowMessage"
            />
          </Field>

          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>

          <JbButton
            type="submit"
            color="login"
            class="w-full rounded-lg text-sm"
            :icon="mdiArrowRight"
            label="Создать аккаунт"
            :disabled="!allFieldsAreValid"
          />
        </div>
      </transition-group>
    </CardComponent>
  </FullScreenSection>
</template>

<script>
import axios from 'axios'
import { mdiEmailOutline, mdiEyeOutline, mdiEyeOffOutline, mdiAccountOutline, mdiArrowRight, mdiCheckBold, mdiChevronLeft, mdiPhoneOutline } from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Icon from '@/components/Icon.vue'
import { uuidv4 } from '@/helpers/functions'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import { USER_START_ONBOARDING } from '@/store/actions/onboarding.js'
import { AUTH_REQUEST, GOOGLE_AUTH_REQUEST, AUTH_REGISTER } from '@/store/actions/auth'
// import { decodeCredential } from 'vue3-google-login'
import { maska } from 'maska'
import * as SLIDES from '@/store/actions/slides.js'
import * as TASK from '@/store/actions/tasks'
import { CREATE_COLOR_REQUEST } from '@/store/actions/colors'
import * as PROJECT from '@/store/actions/projects'
import * as REGLAMENTS from '@/store/actions/reglaments'
import * as QUESTIONS from '@/store/actions/reglament_questions'
import * as ANSWER from '@/store/actions/reglament_answers'
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'
import * as NAVIGATOR from '@/store/actions/navigator'
import * as CLIENTS from '@/store/actions/clients'

export default {
  directives: {
    maska
  },
  components: {
    FullScreenSection,
    CardComponent,
    Field,
    Icon,
    Control,
    JbButton
  },
  data () {
    return {
      mdiEmailOutline,
      mdiEyeOffOutline,
      mdiAccountOutline,
      mdiArrowRight,
      mdiChevronLeft,
      mdiEyeOutline,
      mdiPhoneOutline,
      date: new Date(),
      form: {
        email: '',
        password: '',
        username: '',
        phone: '',
        emailShowError: false,
        emailErrorMessage: 'Некорректный Email',
        showError: false,
        errorMessage: '',
        isEmailValid: true,
        isPasswordInvalid: false,
        emailMdi: mdiEmailOutline,
        emailIconClass: '',
        emailControlDisabled: false,
        startScreenText: 'ЛидерТаск',
        showCheckButton: true,
        showBackButton: false,
        showPassword: false,
        passwordTouched: false,
        usernameTouched: false,
        phoneTouched: false
      },
      showValues: {
        showRegisterInputsValue: false,
        showLoginInputsValue: false
      }
    }
  },
  computed: {
    validatePassword () {
      return this.form.password.trim().length > 7
    },
    user () {
      return this.$store.state.user.user
    },
    validateName () {
      return this.form.username.trim().length > 2
    },
    validatePhone () {
      return !(this.form.phone.length > 0 && this.form.phone.length < 18)
    },
    ifSpaceInPassword () {
      return this.form.password[0] === ' ' || this.form.password[this.form.password.length - 1] === ' '
    },
    ifEmptyFields () {
      return (!this.form.username && this.form.usernameTouched) || (!this.form.password && this.form.passwordTouched)
    },
    allFieldsAreValid () {
      return !this.ifSpaceInPassword && !this.ifEmptyFields && this.validatePassword && this.validatePhone && this.validateName
    }
  },
  methods: {
    login () {
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/auth?login=' + this.form.email + '&password=' + encodeURIComponent(this.form.password) + '&system=' + this.getOSName() + '&type_device=' + this.getSysType()
      this.$store.dispatch(AUTH_REQUEST, uri)
        .then(() => {
          this.$router.push('/doitnow')
          const slideNames = [
            'doitnowstart',
            'addEmployees',
            'addAvatar',
            'delegateTasks'
          ]
          slideNames.forEach(slideName => {
            this.$store.commit(SLIDES.CHANGE_VISIBLE, {
              name: slideName,
              visible: false
            })
          })
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Неверный email пользователя или пароль'
        })
    },
    createDemoElementsAfterRegister () {
      // демо-метки
      const firstTag = {
        back_color: '#4AC7BF',
        uid: uuidv4(),
        name: 'Внимание!'
      }
      this.$store.dispatch(TASK.CREATE_TAG_REQUEST, firstTag)
      const secondTag = {
        back_color: '#FA3865',
        uid: uuidv4(),
        name: 'Срочно!'
      }
      this.$store.dispatch(TASK.CREATE_TAG_REQUEST, secondTag)
      const thirdTag = {
        back_color: '#FFCC00',
        uid: uuidv4(),
        name: 'Важно!'
      }
      this.$store.dispatch(TASK.CREATE_TAG_REQUEST, thirdTag)

      // демо-цвета
      const firstColor = {
        back_color: '#62A5F9',
        fore_color: '',
        uppercase: 0,
        order: 0,
        default: 0,
        email_creator: this.form.email,
        uid: uuidv4(),
        name: 'Синий',
        bold: 0,
        parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
      }
      this.$store.dispatch(CREATE_COLOR_REQUEST, firstColor)
      const secondColor = {
        back_color: '#FFF38B',
        fore_color: '',
        uppercase: 0,
        order: 0,
        default: 0,
        email_creator: this.form.email,
        uid: uuidv4(),
        name: 'Желтый',
        bold: 0,
        parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
      }
      this.$store.dispatch(CREATE_COLOR_REQUEST, secondColor)
      const thirdColor = {
        back_color: '#93FFB9',
        fore_color: '',
        uppercase: 0,
        order: 0,
        default: 0,
        email_creator: this.form.email,
        uid: uuidv4(),
        name: 'Зеленый',
        bold: 0,
        parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
      }
      this.$store.dispatch(CREATE_COLOR_REQUEST, thirdColor)

      // демо-проект
      const project = {
        uid: uuidv4(),
        name: 'Как это работает',
        uid_parent: '00000000-0000-0000-0000-000000000000',
        email_creator: this.form.email,
        order: 1,
        comment: '',
        plugin: '',
        collapsed: 0,
        isclosed: 0,
        group: 0,
        show: 1,
        favorite: 0,
        quiet: 0,
        members: [this.form.email],
        children: [],
        bold: 0
      }
      this.$store.dispatch(PROJECT.CREATE_PROJECT_REQUEST, project).then((res) => {
        // заполняем недостающие параметры
        project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
        // пятая задачка
        const fifthTask = {
          uid: uuidv4(),
          uid_parent: '00000000-0000-0000-0000-000000000000',
          uid_customer: this.form.email,
          uid_project: project.uid,
          status: 0,
          email_performer: '',
          type: 1,
          tags: [],
          name: 'Добавьте участников проекта',
          comment: 'Откройте Меню в верхнем правом углу и добавьте сотрудников в свойствах',
          _addToList: true
        }
        this.$store.dispatch(TASK.CREATE_TASK, fifthTask).then(() => {
          // четвертая задачка
          const fourthTask = {
            uid: uuidv4(),
            uid_parent: '00000000-0000-0000-0000-000000000000',
            uid_customer: this.form.email,
            uid_project: project.uid,
            status: 0,
            email_performer: '',
            type: 1,
            tags: [],
            name: 'Поручите эту задачу сотруднику',
            comment: 'Нажмите на Поручить и выберите сотрудника из списка.\n\nТеперь сотрудник отвечает за выполнение этой задачи.',
            _addToList: true
          }
          this.$store.dispatch(TASK.CREATE_TASK, fourthTask).then(() => {
            const thirdTask = {
              uid: uuidv4(),
              uid_parent: '00000000-0000-0000-0000-000000000000',
              uid_customer: this.form.email,
              uid_project: project.uid,
              status: 0,
              email_performer: '',
              type: 1,
              tags: [],
              name: 'Зажмите задачу и переместите ее в любое место в списке',
              comment: '',
              _addToList: true
            }
            this.$store.dispatch(TASK.CREATE_TASK, thirdTask).then(() => {
              // вторая задачка
              const secondTask = {
                uid: uuidv4(),
                uid_parent: '00000000-0000-0000-0000-000000000000',
                uid_customer: this.form.email,
                uid_project: project.uid,
                status: 0,
                email_performer: '',
                type: 1,
                tags: [],
                name: 'Добавляйте к задачам подзадачи (этапы выполнения основной) - наведите на задачу курсор и нажмите на появившийся тулбар',
                comment: '',
                _addToList: true
              }
              this.$store.dispatch(TASK.CREATE_TASK, secondTask).then(() => {
                // первая задачка с ребенком (папа)
                const firstTask = {
                  uid: uuidv4(),
                  uid_parent: '00000000-0000-0000-0000-000000000000',
                  uid_customer: this.form.email,
                  uid_project: project.uid,
                  status: 0,
                  email_performer: '',
                  type: 1,
                  tags: [],
                  name: 'Нажмите на стрелочку > у этой задачи, чтобы увидеть подзадачи',
                  comment: '',
                  _addToList: true
                }
                this.$store.dispatch(TASK.CREATE_TASK, firstTask).then(() => {
                  // ребенок первой задачки (сынок)
                  const firstTaskChildren = {
                    uid: uuidv4(),
                    uid_parent: firstTask.uid,
                    uid_customer: this.form.email,
                    uid_project: project.uid,
                    status: 0,
                    email_performer: '',
                    type: 1,
                    tags: [],
                    name: 'Подзадача имеет такие же свойства, как и задача',
                    comment: 'Присвойте задаче цвет, добавьте к ней метки или чек-лист.\r\n\r\nИспользуйте кнопки выше.',
                    _addToList: true
                  }
                  this.$store.dispatch(TASK.CREATE_TASK, firstTaskChildren).then(() => {
                    // демо-задача в Сегодня и в проекте Как это работает
                    const tags = [firstTag.uid]
                    const todayTask = {
                      uid: uuidv4(),
                      uid_parent: '00000000-0000-0000-0000-000000000000',
                      uid_customer: this.form.email,
                      uid_project: project.uid,
                      uid_marker: firstColor.uid,
                      status: 0,
                      email_performer: '',
                      type: 1,
                      date_begin: this.getDateString(this.date) + 'T00:00:00',
                      date_end: this.getDateString(this.date) + 'T23:59:59',
                      tags: tags,
                      name: 'Прочитайте задачу и завершите ее',
                      comment: 'Сюда можно вносить все детали по задаче - заметки и ссылки.\n\nА еще к задачам можно прикреплять файлы, вести переписку с коллегами в чате, создавать чек-листы.\n\nСоздавайте задачи для себя и сотрудников в разделе Задачи в Навигаторе.',
                      _addToList: true
                    }
                    this.$store.dispatch(TASK.CREATE_TASK, todayTask)
                  })
                })
              })
            })
          })
        })
      })

      // // демо-регламент
      const reglamentContent = '<h1>Поздравляем! Вы присоединились к тысячам пользователей и бизнесов, использующих ЛидерТаск для управления задачами, поручениями, проектами каждый день!</h1><p><br></p><h2>Что такое регламенты и как они помогут вам в вашем бизнесе?</h2><p><br></p><p>Регламенты - это инструкции, правила, руководства, которые позволят вам наладить работу команды, автоматизируют процесс внедрения новых сотрудников и позволят вам управлять бизнесом удаленно.</p><p><br></p><p>Создавайте регламенты, чтобы составить: </p><p><br></p><ul><li>инструкции по работе конкретных сотрудников или отделов (что и как нужно делать)</li><li>правила компании (общие правила, касающиеся всех и каждого)</li><li>миссию вашего бизнеса (чтобы каждый знал для чего и на что он работает)</li><li>систему мотивации "KPI" (пропишите правила премирования, проценты с продаж и многое другое)</li></ul><p><br></p><p>Регламенты состоят из:</p><p><br></p><ul><li>текста описания инструкции, правил, руководств</li><li>теста на знание этих правил</li><li>данных об успешном прохождении регламентов (в любой момент вы сможете посмотреть кто прошел регламент, а кто нет)</li></ul><p><br></p><p>Вы также можете предоставить доступ к редактированию регламента вашим сотрудникам. Используйте правило "Принес проблему - захвати решение". Вы всего знать не можете и не должны. Если что-то изменилось в работе отдела или сотрудника, дайте доступ к инструкции ответственному сотруднику и пускай он сам внесет необходимые изменения.</p><p><br></p><p><strong>Регламенты решают проблему внедрения новых сотрудников в компанию</strong>. Вы просто добавляете его в ЛидерТаск, он изучает все регламенты, сдает по ним тесты и приступает к работе. Вам больше не надо каждый раз объяснять новичкам одно и тоже. </p><p><br></p><h2>Создайте свой первый регламент! </h2><p><br></p><ol><li>Нажмите на кнопку +</li><li>Подробно опишите правила или инструкцию</li><li>Создайте тест</li><li>Пройдите его сами</li><li>Поручите вашим сотрудникам изучить регламент и выполнить тест</li><li>Получите обратную связь (ответственный сотрудник внимательно прочитает инструкцию, выполнит тест и, возможно, попросит внести правки; неответственный в лучшем случае сделает все не сразу, в худшем вообще проигнорирует. Дальше выводы делать вам)</li></ol><p><br></p><p>А теперь пройдите тест на знание регламентов)</p>'
      const reglament = {
        bold: 0,
        color: '',
        organization: this.form.email,
        email_creator: this.form.email,
        name: 'Добро пожаловать в ЛидерТаск!',
        department_uid: '',
        content: reglamentContent,
        uid: uuidv4()
      }
      this.$store.dispatch(REGLAMENTS.CREATE_REGLAMENT_REQUEST, reglament).then(() => {
        // вопросы и ответы демо-регламента
        // первый вопрос
        const firstQuestion = {
          name: 'Из чего состоят регламенты?',
          uid: uuidv4(),
          uid_reglament: reglament.uid
        }
        this.$store.dispatch(QUESTIONS.CREATE_REGLAMENT_QUESTION_REQUEST, firstQuestion).then(() => {
          // ответы первого вопроса
          const firstQuestionFirstAnswer = {
            uid: uuidv4(),
            uid_question: firstQuestion.uid,
            name: 'Информация о сотрудниках, прошедших регламент',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, firstQuestionFirstAnswer)
          const firstQuestionSecondAnswer = {
            uid: uuidv4(),
            uid_question: firstQuestion.uid,
            name: 'Описание регламента',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, firstQuestionSecondAnswer)
          const firstQuestionThirdAnswer = {
            uid: uuidv4(),
            uid_question: firstQuestion.uid,
            name: 'Тест',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, firstQuestionThirdAnswer)
          const firstQuestionFourthAnswer = {
            uid: uuidv4(),
            uid_question: firstQuestion.uid,
            name: 'Проект',
            is_right: 0
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, firstQuestionFourthAnswer)
          const firstQuestionFifthAnswer = {
            uid: uuidv4(),
            uid_question: firstQuestion.uid,
            name: 'Доска',
            is_right: 0
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, firstQuestionFifthAnswer)
          const firstQuestionSixthAnswer = {
            uid: uuidv4(),
            uid_question: firstQuestion.uid,
            name: 'Задача',
            is_right: 0
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, firstQuestionSixthAnswer)
        })
        // второй вопрос
        const secondQuestion = {
          name: 'Что такое регламент?',
          uid: uuidv4(),
          uid_reglament: reglament.uid
        }
        this.$store.dispatch(QUESTIONS.CREATE_REGLAMENT_QUESTION_REQUEST, secondQuestion).then(() => {
          // ответы второго вопроса
          const secondQuestionFirstAnswer = {
            uid: uuidv4(),
            uid_question: secondQuestion.uid,
            name: 'Инструкции, правила, руководства',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, secondQuestionFirstAnswer)
          const secondQuestionSecondAnswer = {
            uid: uuidv4(),
            uid_question: secondQuestion.uid,
            name: 'Регулярные задачи',
            is_right: 0
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, secondQuestionSecondAnswer)
          const secondQuestionThirdAnswer = {
            uid: uuidv4(),
            uid_question: secondQuestion.uid,
            name: 'Одноразовые задачи',
            is_right: 0
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, secondQuestionThirdAnswer)
        })

        // третий вопрос
        const thirdQuestion = {
          name: 'Чем могут быть регламенты?',
          uid: uuidv4(),
          uid_reglament: reglament.uid
        }
        this.$store.dispatch(QUESTIONS.CREATE_REGLAMENT_QUESTION_REQUEST, thirdQuestion).then(() => {
          // ответы третьего вопроса
          const thirdQuestionFirstAnswer = {
            uid: uuidv4(),
            uid_question: thirdQuestion.uid,
            name: 'Описанием системы мотивации',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, thirdQuestionFirstAnswer)
          const thirdQuestionSecondAnswer = {
            uid: uuidv4(),
            uid_question: thirdQuestion.uid,
            name: 'Инструкцией',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, thirdQuestionSecondAnswer)
          const thirdQuestionThirdAnswer = {
            uid: uuidv4(),
            uid_question: thirdQuestion.uid,
            name: 'Правилами компании',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, thirdQuestionThirdAnswer)
          const thirdQuestionFourthAnswer = {
            uid: uuidv4(),
            uid_question: thirdQuestion.uid,
            name: 'Задачей',
            is_right: 0
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, thirdQuestionFourthAnswer)
          const thirdQuestionFifthAnswer = {
            uid: uuidv4(),
            uid_question: thirdQuestion.uid,
            name: 'Миссией бизнеса',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, thirdQuestionFifthAnswer)
        })

        // четвертый вопрос
        const fourthQuestion = {
          name: 'Как создать хороший регламент?',
          uid: uuidv4(),
          uid_reglament: reglament.uid
        }
        this.$store.dispatch(QUESTIONS.CREATE_REGLAMENT_QUESTION_REQUEST, fourthQuestion).then(() => {
          // ответы четвертого вопроса
          const fourthQuestionFirstAnswer = {
            uid: uuidv4(),
            uid_question: fourthQuestion.uid,
            name: 'Добавить описание',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, fourthQuestionFirstAnswer)
          const fourthQuestionSecondAnswer = {
            uid: uuidv4(),
            uid_question: fourthQuestion.uid,
            name: 'Составить тест',
            is_right: 1
          }
          this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, fourthQuestionSecondAnswer)
        })
      })

      // демо-клиент
      const clientToSend = {
        uid: uuidv4(),
        organization: this.form.email,
        name: this.form.username,
        email: this.form.email,
        phone: this.form.phone.replace(/[^a-zA-Z0-9+]/g, ''),
        comment: 'Комментарий контакта',
        date_create: new Date().toLocaleString()
      }
      this.$store.dispatch(CLIENTS.ADD_NEW_CLIENT, clientToSend)

      // демо-доска
      const boardData = {
        uid: uuidv4(),
        name: 'Как работают доски',
        email_creator: this.form.email,
        members: this.user.current_user_uid
      }
      this.$store.dispatch(BOARD.CREATE_BOARD_REQUEST, boardData).then((res) => {
        const board = res.data
        board.global_property_uid = '1b30b42c-b77e-40a4-9b43-a19991809add'
        board.color = '#A998B6'
        this.$store.commit(BOARD.PUSH_BOARD, [board])
        this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_BOARD, [board])

        // колонки для демо-доски
        // колонка Новое
        this.$store
          .dispatch(BOARD.ADD_STAGE_BOARD_REQUEST, {
            boardUid: boardData.uid,
            newStageTitle: 'Новое'
          }).then((resp) => {
            // 1 карточка
            this.$store
              .dispatch(CARD.ADD_CARD, {
                name: 'Прочитайте эту карточку и отправьте ее в Архив',
                order: 1,
                comment: 'В очередь попадают и карточки из досок. Если вы становитесь ответственным за какую-то карточку, то она обязательно попадет к вам в Очередь.\r\n\r\nКарточкой может быть заявкой, заказом от клиента или задачей в рамках системы Канбан',
                uid_board: boardData.uid,
                uid_stage: resp.UID,
                user: this.form.email
              }).then(() => {
                // 2 карточка
                this.$store
                  .dispatch(CARD.ADD_CARD, {
                    name: 'Карточка может быть «Заявкой»',
                    order: 2,
                    comment: 'Создайте форму сбора заявок для этой доски через Меню в верхнем правом углу',
                    uid_board: boardData.uid,
                    uid_stage: resp.UID
                  }).then(() => {
                    // 3 карточка
                    this.$store
                      .dispatch(CARD.ADD_CARD, {
                        name: 'А может быть "Целью"',
                        order: 3,
                        comment: 'И при этом с красивой обложкой',
                        cover_color: '#276162',
                        cover_link: 'https://web.leadertask.com/api/v1/cover/getimage?uid=70bd0e8a-7a9a-4779-a363-ad9f6ecd266c',
                        cover_size_x: 1497,
                        cover_size_y: 993,
                        uid_board: boardData.uid,
                        uid_stage: resp.UID,
                        uid_cover_file: '70bd0e8a-7a9a-4779-a363-ad9f6ecd266c'
                      }).then(() => {
                        // 4 карточка
                        this.$store
                          .dispatch(CARD.ADD_CARD, {
                            name: 'Или даже «Заказом»',
                            order: 4,
                            comment: 'И даже с установленным бюджетом\r↵\r↵А в колонке отображается сумма бюджетов всех карточек в ней',
                            uid_board: boardData.uid,
                            uid_stage: resp.UID
                          }).then(() => {
                            // колонка В работе
                            this.$store
                              .dispatch(BOARD.ADD_STAGE_BOARD_REQUEST, {
                                boardUid: boardData.uid,
                                newStageTitle: 'В работе'
                              }).then((resp) => {
                                // 1 карточка
                                this.$store
                                  .dispatch(CARD.ADD_CARD, {
                                    name: 'Карточки можно перетаскивать между колонками мышкой',
                                    comment: '',
                                    uid_board: boardData.uid,
                                    uid_stage: resp.UID
                                  }).then(() => {
                                    // колонка Достигнуто
                                    this.$store
                                      .dispatch(BOARD.ADD_STAGE_BOARD_REQUEST, {
                                        boardUid: boardData.uid,
                                        newStageTitle: 'Достигнуто'
                                      }).then((resp) => {
                                        // 1 карточка
                                        this.$store
                                          .dispatch(CARD.ADD_CARD, {
                                            name: 'В доске может быть любое количество колонок',
                                            comment: 'Колонки можно точно также перетаскивать мышкой вместе со всеми карточками',
                                            uid_board: boardData.uid,
                                            uid_stage: resp.UID
                                          }).then(() => {
                                            // 2 карточка
                                            this.$store
                                              .dispatch(CARD.ADD_CARD, {
                                                name: 'Автоматизируйте получение новых заявок и заказов',
                                                comment: 'Создайте форму сбора заявок и разместите ее у себя на сайте - смотрите Меню в верхнем правом углу',
                                                uid_board: boardData.uid,
                                                uid_stage: resp.UID
                                              }).then(() => {
                                                // 3 карточка
                                                this.$store
                                                  .dispatch(CARD.ADD_CARD, {
                                                    name: 'C помощью досок можно сделать CRM для работы с клиентами, Канбан или красивую визуализацию целей',
                                                    comment: 'Добавьте свои доски',
                                                    uid_board: boardData.uid,
                                                    uid_stage: resp.UID
                                                  })
                                              })
                                          })
                                      })
                                  })
                              })
                          })
                      })
                  })
              })
          })
      })
    },
    register () {
      if (!this.form.password || !this.form.username) { return }
      const date = new Date()
      const timezone = date.getTimezoneOffset() / 60 * (-1)
      const cid = localStorage.getItem('cid') ?? 'webnew'
      const data = {
        email: this.form.email,
        password: this.form.password,
        name: this.form.username,
        phone: this.form.phone.replace(/[^a-zA-Z0-9+]/g, ''),
        timezone: timezone,
        system: 'web',
        cid: cid,
        language: 'russian',
        type_device: 'mobile'
      }
      this.$store.dispatch(AUTH_REGISTER, data)
        .then(() => {
          window.ym(89796698, 'reachGoal', 'signup-new-web')
          localStorage.removeItem('slides')
          const slideNames = [
            'doitnowstart',
            'addEmployees',
            'addAvatar',
            'delegateTasks'
          ]
          slideNames.forEach(slideName => {
            this.$store.commit(SLIDES.CHANGE_VISIBLE, {
              name: slideName,
              visible: true
            })
          })
          this.$store.dispatch(USER_START_ONBOARDING)
          // демо-данные для новых пользователей
          this.createDemoElementsAfterRegister()
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Unknown error'
        }).finally(() => {
          this.$router.push('/doitnow')
        })
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    getDateString (date) {
      const month = this.pad2(date.getMonth() + 1)
      const day = this.pad2(date.getDate())
      const year = this.pad2(date.getFullYear())
      return year + '-' + month + '-' + day
    },
    submit () {
      if (this.showValues.showLoginInputsValue) {
        this.login()
      } else if (this.showValues.showRegisterInputsValue) {
        this.validateAndShowMessage()
        if (this.form.showError) {
          return
        }
        this.register()
      }
    },
    getOSName () {
      let detectOS = 'web'

      if (navigator.appVersion.indexOf('Mac') !== -1) {
        detectOS = 'mac'
      } else if (navigator.appVersion.indexOf('Win') !== -1) {
        detectOS = 'windows'
      } else if (navigator.appVersion.indexOf('Android') !== -1) {
        detectOS = 'android'
      } else if (navigator.appVersion.indexOf('iPhone') !== -1) {
        detectOS = 'ios'
      }

      return detectOS
    },
    isMobile () {
      return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
    },
    getSysType () {
      return this.isMobile() ? 'mobile' : 'desktop'
    },
    hideLoginInputs () {
      this.showValues.showLoginInputsValue = false
    },
    hideRegisterInputs () {
      this.showValues.showRegisterInputsValue = false
    },
    showLoginInputs () {
      this.showValues.showLoginInputsValue = true
      this.hideRegisterInputs()
    },
    showRegisterInputs () {
      this.showValues.showRegisterInputsValue = true
      this.hideLoginInputs()
    },
    getBack () {
      this.hideLoginInputs()
      this.hideRegisterInputs()
      this.form.emailControlDisabled = false
      this.form.email = ''
      this.form.password = ''
      this.form.username = ''
      this.form.phone = ''
      this.form.startScreenText = 'ЛидерТаск'
      this.form.emailMdi = mdiEmailOutline
      this.form.emailIconClass = ''
      this.form.showCheckButton = true
      this.form.showBackButton = false
      this.form.showError = false
      this.form.showPassword = false
      this.form.errorMessage = ''
    },
    validateEmail () {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.form.email)) {
        return true
      }
      return false
    },
    checkEmailExistense () {
      if (this.validateEmail()) {
        this.form.isEmailValid = true
        this.form.emailShowError = false

        const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/exists?email=' + this.form.email
        axios.get(uri)
          .then(() => {
            this.showLoginInputs()
            this.form.emailMdi = mdiCheckBold
            this.form.startScreenText = 'Войти в ЛидерТаск'
            this.form.emailIconClass = 'text-lime-500'
            this.form.emailControlDisabled = true
            this.form.showCheckButton = false
            this.form.showBackButton = true
          })
          .catch(() => {
            this.showRegisterInputs()
            this.form.emailMdi = mdiCheckBold
            this.form.startScreenText = 'Создать аккаунт'
            this.form.emailIconClass = 'text-lime-500'
            this.form.emailControlDisabled = true
            this.form.showCheckButton = false
            this.form.showBackButton = true
          })
      } else {
        this.form.isEmailValid = false
        this.form.emailShowError = true
      }
    },
    togglePasswordVisibility () {
      this.form.showPassword = !this.form.showPassword
    },
    validateAndShowMessage () {
      if (this.ifSpaceInPassword && this.form.passwordTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Символ пробела в начале и в конце пароля недопустим'
      } else if (!this.validatePassword && this.form.passwordTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Длина пароля не может быть меньше 8 символов'
      } else if (!this.validateName && this.form.usernameTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Длина имени не может быть меньше 3 символов'
      } else if (!this.validatePhone && this.form.phoneTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Некорректный номер телефона'
      } else if (this.ifEmptyFields) {
        this.form.showError = true
        this.form.errorMessage = 'Для успешной регистрации заполните все поля'
      } else if (this.form.showError) {
        this.form.showError = false
        this.form.errorMessage = ''
      }
    },
    googleCallback (response) {
      localStorage.removeItem('slides')
      console.log('Handle the response', response)
      const cid = localStorage.getItem('cid') ?? 'webnew'
      const data = {
        token: response.access_token,
        system: 'web',
        language: 'russian',
        type_device: 'mobile',
        cid: cid
      }
      this.$store.dispatch(GOOGLE_AUTH_REQUEST, data)
        .then((resp) => {
          if (resp?.data?.is_new_user) {
            window.ym(89796698, 'reachGoal', 'signup-new-web')
          }
          this.$router.push('/')
          this.$store.dispatch(USER_START_ONBOARDING)
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Unknown error'
        })
    }
  }
}
</script>

<style>
.error-message {
  color: #8D021F;
  font-size: 14px;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(45px);
  opacity: 0;
}
</style>
