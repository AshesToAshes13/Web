<template>
  <ModalBoxAddClient
    v-if="showAddClient"
    title="Добавить контакт"
    :card-email="cardEmail"
    :card-phone="cardPhone"
    @cancel="showAddClient = false"
    @save="onAddNewClient"
  />
  <Popper
    class="light overflow-hidden"
    :disabled="!canEdit"
    @open:popper="onShowClients"
  >
    <div
      class="text-[12px] py-[5px] font-[500] bg-[#F4F5F7] text-[#575758]"
      :class="{ 'cursor-pointer': canEdit, 'flex items-center hover:bg-[#0000000a] h-[40px] px-[20px] rounded-[8px]': isQueue, 'px-[8px] rounded-[6px]': !isQueue }"
    >
      <div
        v-if="!isClientSet"
        class="flex items-center"
      >
        <svg
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          class="mr-[7px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
            fill="currentColor"
          />
        </svg>
        <span class="truncate">Контакт</span>
      </div>
      <div
        v-else
        class="flex items-center group"
      >
        <svg
          width="17"
          height="14"
          viewBox="0 0 13 14"
          :class="{'group-hover:hidden': canEdit }"
          fill="none"
          class="mr-[7px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
            fill="#7E7E80"
          />
        </svg>
        <div
          class="items-center justify-center p-[4.5px] mr-[4px] hidden"
          :class="{'group-hover:flex': canEdit }"
          @click.stop="$emit('changeClient', ['', ''])"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class=""
          >
            <path
              d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"
              fill="#7E7E80"
            />
          </svg>
        </div>
        <span class="truncate">{{ clientName }}</span>
      </div>
    </div>
    <template
      #content="{ close }"
    >
      <div class="flex items-center justify-between w-[300px]">
        <CardClientSearch
          @search="searchClients"
          @eraseSearch="requestClients"
        />
      </div>
      <div
        class="h-[360px] w-[320px] overflow-y-scroll overflow-x-hidden scroll-style relative"
      >
        <svg
          v-if="clientsStatus === 'loading'"
          class="m-auto w-[20px] h-[20px] text-gray-200 animate-spin dark:text-gray-600 fill-orange-400 mt-[16px]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <div
          v-else
        >
          <div
            v-if="!searchText && (cardPhone || cardEmail)"
            class="flex items-center mt-[16px] px-[6px] py-[4px] hover:bg-[#F4F5F7] rounded-[6px] cursor-pointer w-[300px]"
            @click="showModalAddClient"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="34"
                height="34"
                rx="4"
                fill="#F4F5F7"
              />
              <path
                d="M17.9383 16.0603L17.9445 10.3386C17.9445 10.0878 17.8449 9.84717 17.6675 9.66978C17.4901 9.49238 17.2495 9.39272 16.9986 9.3927C16.7478 9.39268 16.5072 9.49231 16.3298 9.66968C16.1525 9.84705 16.0528 10.0876 16.0528 10.3385L16.0599 16.0602L10.3382 16.0531C10.0874 16.0531 9.84678 16.1527 9.66942 16.3301C9.49205 16.5075 9.39241 16.748 9.39243 16.9989C9.39245 17.2497 9.49212 17.4903 9.66951 17.6677C9.8469 17.8451 10.0875 17.9448 10.3383 17.9448L16.06 17.9386L16.0538 23.6603C16.0533 23.7846 16.0774 23.9078 16.1248 24.0228C16.1721 24.1378 16.2418 24.2423 16.3297 24.3302C16.4177 24.4182 16.5221 24.4878 16.6371 24.5352C16.7521 24.5825 16.8754 24.6067 16.9997 24.6062C17.1241 24.6067 17.2473 24.5826 17.3623 24.5352C17.4772 24.4879 17.5817 24.4182 17.6696 24.3303C17.7576 24.2424 17.8272 24.1379 17.8746 24.0229C17.9219 23.908 17.946 23.7847 17.9455 23.6604L17.9384 17.9387L23.6601 17.9457C23.7845 17.9463 23.9077 17.9222 24.0227 17.8748C24.1377 17.8275 24.2421 17.7578 24.3301 17.6699C24.418 17.582 24.4876 17.4775 24.535 17.3625C24.5823 17.2475 24.6064 17.1243 24.6059 17C24.6064 16.8756 24.5823 16.7524 24.5349 16.6374C24.4876 16.5224 24.4179 16.4179 24.33 16.33C24.242 16.2421 24.1375 16.1724 24.0226 16.125C23.9076 16.0777 23.7843 16.0536 23.66 16.0541L17.9383 16.0603Z"
                fill="#424242"
              />
            </svg>
            <div class="ml-[10px]">
              <div class="text-[#4C4C4D] text-[13px] leading-[14px] truncate font-medium">
                Добавить новый контакт
              </div>
              <div
                class="text-[#6A6A6C] text-[11px] leading-[12px] truncate"
              >
                {{ `${cardPhone} ${cardEmail ? ' <' + cardEmail + '>' : ''}` }}
              </div>
            </div>
          </div>
          <template
            v-if="!clients.length"
          >
            <div class="text-[#7E7E80] text-[13px] text-center leading-[14px] px-[36px] py-[12px] break-word mt-[115px]">
              {{ searchResult }}
            </div>
          </template>
          <template
            v-for="(client, index) in clients"
            v-else
            :key="index"
          >
            <div
              class="flex items-center px-[6px] py-[4px] hover:bg-[#F4F5F7] rounded-[6px] cursor-pointer"
              @mouseover="hoverClient = client.uid"
              @mouseleave="hoverClient = ''"
              @click="$emit('changeClient', [client.uid, client.name]), close()"
            >
              <svg
                v-if="hoverClient !== client.uid"
                class="flex-none mr-[10px]"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="34"
                  height="34"
                  rx="4"
                  fill="#EFF0F2"
                />
                <path
                  d="M17 16.2457C18.046 16.2457 19.0686 15.9356 19.9383 15.3544C20.8081 14.7733 21.486 13.9472 21.8863 12.9808C22.2866 12.0144 22.3913 10.951 22.1872 9.92505C21.9832 8.8991 21.4794 7.95671 20.7398 7.21705C20.0001 6.47739 19.0577 5.97367 18.0318 5.7696C17.0058 5.56552 15.9424 5.67026 14.976 6.07056C14.0096 6.47087 13.1836 7.14876 12.6024 8.01851C12.0213 8.88826 11.7111 9.91082 11.7111 10.9569C11.7111 12.3596 12.2683 13.7048 13.2602 14.6967C14.252 15.6885 15.5973 16.2457 17 16.2457ZM17 7.17908C17.7471 7.17908 18.4775 7.40064 19.0988 7.81575C19.72 8.23086 20.2042 8.82087 20.4902 9.51117C20.7761 10.2015 20.8509 10.961 20.7052 11.6939C20.5594 12.4267 20.1996 13.0998 19.6713 13.6281C19.1429 14.1565 18.4698 14.5163 17.737 14.662C17.0042 14.8078 16.2446 14.733 15.5543 14.4471C14.864 14.1611 14.274 13.6769 13.8589 13.0557C13.4437 12.4344 13.2222 11.704 13.2222 10.9569C13.2222 9.95493 13.6202 8.99404 14.3287 8.28557C15.0371 7.5771 15.998 7.17908 17 7.17908Z"
                  fill="black"
                  fill-opacity="0.3"
                />
                <path
                  d="M26.4217 21.8142C25.2101 20.5335 23.7499 19.5134 22.1306 18.8163C20.5113 18.1192 18.7668 17.7596 17.0037 17.7596C15.2407 17.7596 13.4962 18.1192 11.8769 18.8163C10.2576 19.5134 8.79742 20.5335 7.58574 21.8142C7.32304 22.0948 7.17714 22.4649 7.17774 22.8493V26.8235C7.17774 27.2243 7.33694 27.6087 7.62033 27.892C7.90372 28.1754 8.28808 28.3346 8.68885 28.3346H25.3111C25.7118 28.3346 26.0962 28.1754 26.3796 27.892C26.663 27.6087 26.8222 27.2243 26.8222 26.8235V22.8493C26.8248 22.466 26.6817 22.0959 26.4217 21.8142ZM25.3111 26.8235H8.68885V22.8417C9.75964 21.7142 11.0487 20.8164 12.4775 20.2028C13.9063 19.5893 15.445 19.2729 17 19.2729C18.5549 19.2729 20.0936 19.5893 21.5224 20.2028C22.9513 20.8164 24.2403 21.7142 25.3111 22.8417V26.8235Z"
                  fill="black"
                  fill-opacity="0.3"
                />
                <path
                  d="M25.3111 26.8235H8.68885V22.8417C9.75964 21.7142 11.0487 20.8164 12.4775 20.2028C13.9063 19.5893 15.445 19.2729 17 19.2729C18.5549 19.2729 20.0936 19.5893 21.5224 20.2028C22.9513 20.8164 24.2403 21.7142 25.3111 22.8417V26.8235Z"
                  fill="black"
                  fill-opacity="0.3"
                />
                <path
                  d="M17 7.17908C17.7471 7.17908 18.4775 7.40064 19.0988 7.81575C19.72 8.23086 20.2042 8.82087 20.4902 9.51117C20.7761 10.2015 20.8509 10.961 20.7052 11.6939C20.5594 12.4267 20.1996 13.0998 19.6713 13.6281C19.1429 14.1565 18.4698 14.5163 17.737 14.662C17.0042 14.8078 16.2446 14.733 15.5543 14.4471C14.864 14.1611 14.274 13.6769 13.8589 13.0557C13.4437 12.4344 13.2222 11.704 13.2222 10.9569C13.2222 9.95493 13.6202 8.99404 14.3287 8.28557C15.0371 7.5771 15.998 7.17908 17 7.17908Z"
                  fill="black"
                  fill-opacity="0.3"
                />
              </svg>
              <svg
                v-else
                class="flex-none mr-[10px]"
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="34"
                  height="34"
                  rx="4"
                  fill="white"
                />
                <path
                  d="M17.9383 16.0603L17.9445 10.3386C17.9445 10.0878 17.8449 9.84717 17.6675 9.66978C17.4901 9.49238 17.2495 9.39272 16.9986 9.3927C16.7478 9.39268 16.5072 9.49231 16.3298 9.66968C16.1525 9.84705 16.0528 10.0876 16.0528 10.3385L16.0599 16.0602L10.3382 16.0531C10.0874 16.0531 9.84678 16.1527 9.66942 16.3301C9.49205 16.5075 9.39241 16.748 9.39243 16.9989C9.39245 17.2497 9.49212 17.4903 9.66951 17.6677C9.8469 17.8451 10.0875 17.9448 10.3383 17.9448L16.06 17.9386L16.0538 23.6603C16.0533 23.7846 16.0774 23.9078 16.1248 24.0228C16.1721 24.1378 16.2418 24.2423 16.3297 24.3302C16.4177 24.4182 16.5221 24.4878 16.6371 24.5352C16.7521 24.5825 16.8754 24.6067 16.9997 24.6062C17.1241 24.6067 17.2473 24.5826 17.3623 24.5352C17.4772 24.4879 17.5817 24.4182 17.6696 24.3303C17.7576 24.2424 17.8272 24.1379 17.8746 24.0229C17.9219 23.908 17.946 23.7847 17.9455 23.6604L17.9384 17.9387L23.6601 17.9457C23.7845 17.9463 23.9077 17.9222 24.0227 17.8748C24.1377 17.8275 24.2421 17.7578 24.3301 17.6699C24.418 17.582 24.4876 17.4775 24.535 17.3625C24.5823 17.2475 24.6064 17.1243 24.6059 17C24.6064 16.8756 24.5823 16.7524 24.5349 16.6374C24.4876 16.5224 24.4179 16.4179 24.33 16.33C24.242 16.2421 24.1375 16.1724 24.0226 16.125C23.9076 16.0777 23.7843 16.0536 23.66 16.0541L17.9383 16.0603Z"
                  fill="#424242"
                />
              </svg>

              <div class="my-[4px] max-w-[265px]">
                <div class="text-[#4C4C4D] text-[13px] leading-[15px] truncate">
                  {{ client.name }}
                </div>
                <div
                  v-if="client.phone || client.email"
                  class="text-[#7e7e80] text-[12px] leading-[14px] truncate"
                >
                  {{ `${client.phone} ${client.email ? ' <' + client.email + '>' : ''}` }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import * as CLIENTS from '@/store/actions/clients'
import Popper from 'vue3-popper'
import CardClientSearch from '@/components/CardProperties/CardClientSearch.vue'
import ModalBoxAddClient from '@/components/Clients/ModalBoxAddClient.vue'

export default {
  components: {
    CardClientSearch,
    ModalBoxAddClient,
    Popper
  },
  props: {
    clientUid: {
      type: String,
      default: ''
    },
    clientName: {
      type: String,
      default: ''
    },
    cardName: {
      type: String,
      default: ''
    },
    cardComment: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    isQueue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeClient'],
  data () {
    return {
      showAddClient: false,
      searchResult: '',
      searchText: '',
      hoverClient: {}
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    clients () {
      return this.$store.state.clients.clients
    },
    clientsStatus () {
      return this.$store.state.clients.status
    },
    isClientSet () {
      return this.clientUid && this.clientUid !== '00000000-0000-0000-0000-000000000000'
    },
    cardEmail () {
      return this.checkIfEmailInString(this.cardName) || this.checkIfEmailInString(this.cardComment)
    },
    cardPhone () {
      return this.checkIfPhoneInString(this.cardName) || this.checkIfPhoneInString(this.cardComment)
    }
  },
  methods: {
    onShowClients () {
      this.requestClients()
    },
    requestClients () {
      if (this.cardEmail) {
        this.searchClients(this.cardEmail)
      } else if (this.cardPhone) {
        this.searchClients(this.cardPhone)
      } else {
        this.$store.commit(CLIENTS.SET_CLIENTS, [])
      }
      this.searchText = ''
      this.searchResult = 'Найдите контакт по имени, email или номеру телефона'
    },
    searchClients (text) {
      const data = {
        organization: this.user?.owner_email,
        page: 1,
        search: text
      }
      this.$store.dispatch(CLIENTS.GET_CLIENTS, data)
      this.searchText = text
      this.searchResult = 'Контакт не найден'
    },
    checkIfEmailInString (text) {
      const regex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
      return regex.exec(text) ? regex.exec(text)[0] : ''
    },
    checkIfPhoneInString (text) {
      const regex = /(\+7|8)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g
      const exected = regex.exec(text)
      return exected ? exected[0] : ''
    },
    showModalAddClient () {
      this.showAddClient = true
    },
    async onAddNewClient (client) {
      this.showAddClient = false
      const clientToSend = {
        uid: client.uid,
        organization: this.user?.owner_email,
        name: client.name,
        email: client.email,
        phone: client.phone,
        comment: client.comment,
        date_create: client.date_create
      }
      await this.$store.dispatch(CLIENTS.ADD_NEW_CLIENT, clientToSend)
      await this.$emit('changeClient', [clientToSend.uid, clientToSend.name])
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 10px 10px;
  --popper-theme-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 3px 5px rgba(0, 0, 0, 0.12);
}
</style>
