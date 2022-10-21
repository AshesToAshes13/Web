<template>
  <div
    class="board-card max-w-[252px] group bg-white rounded-[6px] border px-[18px] py-[20px] transition-colors hover:cursor-pointer"
    :class="{ 'border-[rgba(0,0,0,0.1)]': !selected, 'border-[#ff9123]': selected }"
    :style="getCardStyle"
    @click="selectCard"
    @contextmenu="copyEmail($event)"
  >
    <div
      v-if="onlineUsers.length"
      class="-mt-[30px] -ml-[10px] mb-[10px] flex -space-x-1.5"
    >
      <img
        v-for="user in onlineUsers"
        :key="user"
        :title="user.name"
        class="w-[20px] h-[20px] rounded-full border-[1px] border-blue-300"
        :src="user.fotolink"
      >
    </div>
    <div
      v-show="!readOnly"
      class="flex justify-end mt-[-10px] mr-[-10px] mb-[5px]"
      :class="{'mb-[10px]': haveCover} "
    >
      <div
        :ref="`card-icon-${card.uid}`"
        class="w-[20px] h-[20px] overflow-hidden cursor-pointer invisible group-hover:visible transition-colors bg-[#ffffff8e] hover:bg-[#fffffff8] rounded"
        :style="getDotsStyle"
        @click.stop=""
      >
        <PopMenu
          @openMenu="lockVisibility(card.uid)"
          @closeMenu="unlockVisibility(card.uid)"
        >
          <div
            class="flex items-center justify-center w-[20px] h-[20px]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.35524 16.1055C8.37421 16.1055 7.57892 15.3102 7.57892 14.3291C7.57892 13.3481 8.37421 12.5528 9.35524 12.5528C10.3363 12.5528 11.1316 13.3481 11.1316 14.3291C11.1316 15.3102 10.3363 16.1055 9.35524 16.1055ZM9.35524 10.7765C8.37421 10.7765 7.57892 9.9812 7.57892 9.00016C7.57892 8.01912 8.37421 7.22383 9.35524 7.22383C10.3363 7.22383 11.1316 8.01912 11.1316 9.00016C11.1316 9.9812 10.3363 10.7765 9.35524 10.7765ZM7.57892 3.67118C7.57892 4.65222 8.37421 5.4475 9.35524 5.4475C10.3363 5.4475 11.1316 4.65222 11.1316 3.67118C11.1316 2.69015 10.3363 1.89486 9.35524 1.89486C8.37421 1.89486 7.57892 2.69015 7.57892 3.67118Z"
                fill="#7e7e80"
              />
            </svg>
          </div>
          <template #menu>
            <PopMenuItem
              class="min-w-[150px]"
              icon="move"
              @click="clickMove"
            >
              Переместить
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickMoveToTop"
            >
              В начало колонки
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickMoveToBottom"
            >
              В конец колонки
            </PopMenuItem>
            <PopMenuDivider v-if="!isArchive" />
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickSuccess"
            >
              Архивировать: Успех
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickReject"
            >
              Архивировать: Отказ
            </PopMenuItem>
            <PopMenuDivider />
            <PopMenuItem
              class="min-w-[150px]"
              icon="delete"
              type="delete"
              @click="clickDelete"
            >
              Удалить
            </PopMenuItem>
          </template>
        </PopMenu>
      </div>
    </div>
    <div
      v-if="haveCover"
      class="overflow-hidden rounded-[6px] mb-[20px] flex place-content-center"
      :style="{ background: card.cover_color, height: `${coverHeight}px` }"
    >
      <div
        v-if="card.cover_link"
        class="bg-cover bg-center bg-origin-content bg-clip-content"
        :style="{
          'background-image': `url(${card.cover_link})`,
          height: `${coverSize.y}px`,
          width: `${coverSize.x}px`
        }"
      />
      <div v-else>
&nbsp;
      </div>
    </div>
    <div class="flex items-start justify-between">
      <div class="w-full">
        <p
          class="text-[#424242] font-['Roboto'] mt-[-15px] text-[14px] leading-[18px] font-medium tracking-[.02em] break-words"
        >
          {{ card.name }}
        </p>
      </div>
    </div>
    <div
      v-if="showDate || cost || card.has_files || card.has_msgs || card.date_reminder || card.comment.length || card.client_name"
      class="flex justify-between mt-[20px]"
    >
      <div class="flex flex-wrap gap-1">
        <!-- выводим дату -->
        <div
          v-if="showDate"
          class="flex items-center mr-1"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.33328 1.47884C4.33328 1.15668 4.59445 0.895508 4.91662 0.895508C5.23879 0.895508 5.49996 1.15668 5.49996 1.47884V1.89551H10.5V1.47884C10.5 1.15668 10.7612 0.895508 11.0833 0.895508C11.4055 0.895508 11.6667 1.15668 11.6667 1.47884V1.89551H12.6667C13.403 1.89551 14 2.49247 14 3.22885V11.8956C14 12.6319 13.403 13.2289 12.6667 13.2289H3.33328C2.5969 13.2289 1.99994 12.6319 1.99994 11.8956V3.22885C1.99994 2.49247 2.5969 1.89551 3.33328 1.89551H4.33328V1.47884ZM10.5 2.81218V3.47885C10.5 3.80102 10.7612 4.06219 11.0833 4.06219C11.4055 4.06219 11.6667 3.80102 11.6667 3.47886V2.81218H12.6667C12.8968 2.81218 13.0833 2.99873 13.0833 3.22885V11.8956C13.0833 12.1257 12.8968 12.3122 12.6667 12.3122H3.33328C3.10316 12.3122 2.91661 12.1257 2.91661 11.8956V3.22885C2.91661 2.99873 3.10316 2.81218 3.33328 2.81218H4.33328V3.47885C4.33328 3.80102 4.59445 4.06219 4.91662 4.06219C5.23879 4.06219 5.49996 3.80102 5.49996 3.47885V2.81218H10.5ZM4.86981 5.18357C4.4564 5.18357 4.12127 5.52632 4.12127 5.94913C4.12127 6.37193 4.4564 6.71468 4.86981 6.71468C5.28322 6.71468 5.61835 6.37193 5.61835 5.94913C5.61835 5.52632 5.28322 5.18357 4.86981 5.18357ZM8.28586 5.94913C8.28586 5.52632 8.621 5.18357 9.0344 5.18357C9.44781 5.18357 9.78294 5.52632 9.78294 5.94913C9.78294 6.37193 9.44781 6.71468 9.0344 6.71468C8.621 6.71468 8.28586 6.37193 8.28586 5.94913ZM8.28586 8.09267C8.28586 7.66987 8.621 7.32712 9.0344 7.32712C9.44781 7.32712 9.78294 7.66987 9.78294 8.09267C9.78294 8.51547 9.44781 8.85822 9.0344 8.85822C8.621 8.85822 8.28586 8.51547 8.28586 8.09267ZM8.28586 10.2362C8.28586 9.81341 8.621 9.47066 9.0344 9.47066C9.44781 9.47066 9.78294 9.81341 9.78294 10.2362C9.78294 10.659 9.44781 11.0018 9.0344 11.0018C8.621 11.0018 8.28586 10.659 8.28586 10.2362ZM10.3818 5.94913C10.3818 5.52632 10.7169 5.18357 11.1303 5.18357C11.5437 5.18357 11.8789 5.52632 11.8789 5.94913C11.8789 6.37193 11.5437 6.71468 11.1303 6.71468C10.7169 6.71468 10.3818 6.37193 10.3818 5.94913ZM10.3818 8.09267C10.3818 7.66987 10.7169 7.32712 11.1303 7.32712C11.5437 7.32712 11.8789 7.66987 11.8789 8.09267C11.8789 8.51547 11.5437 8.85822 11.1303 8.85822C10.7169 8.85822 10.3818 8.51547 10.3818 8.09267ZM10.3818 10.2362C10.3818 9.81341 10.7169 9.47066 11.1303 9.47066C11.5437 9.47066 11.8789 9.81341 11.8789 10.2362C11.8789 10.659 11.5437 11.0018 11.1303 11.0018C10.7169 11.0018 10.3818 10.659 10.3818 10.2362ZM4.12127 8.09267C4.12127 7.66987 4.4564 7.32712 4.86981 7.32712C5.28322 7.32712 5.61835 7.66987 5.61835 8.09267C5.61835 8.51547 5.28322 8.85822 4.86981 8.85822C4.4564 8.85822 4.12127 8.51547 4.12127 8.09267ZM4.12127 10.2362C4.12127 9.81341 4.4564 9.47066 4.86981 9.47066C5.28322 9.47066 5.61835 9.81341 5.61835 10.2362C5.61835 10.659 5.28322 11.0018 4.86981 11.0018C4.4564 11.0018 4.12127 10.659 4.12127 10.2362ZM6.21718 5.94913C6.21718 5.52632 6.55232 5.18357 6.96572 5.18357C7.37913 5.18357 7.71426 5.52632 7.71426 5.94913C7.71426 6.37193 7.37913 6.71468 6.96572 6.71468C6.55232 6.71468 6.21718 6.37193 6.21718 5.94913ZM6.21718 8.09267C6.21718 7.66987 6.55232 7.32712 6.96572 7.32712C7.37913 7.32712 7.71426 7.66987 7.71426 8.09267C7.71426 8.51547 7.37913 8.85822 6.96572 8.85822C6.55232 8.85822 6.21718 8.51547 6.21718 8.09267ZM6.21718 10.2362C6.21718 9.81341 6.55232 9.47066 6.96572 9.47066C7.37913 9.47066 7.71426 9.81341 7.71426 10.2362C7.71426 10.659 7.37913 11.0018 6.96572 11.0018C6.55232 11.0018 6.21718 10.659 6.21718 10.2362Z"
              fill="#7e7e80"
            />
          </svg>
          <span
            class="text-[10px] leading-[12px] text-[#7e7e80] font-['Roboto'] mx-0.5"
          >
            {{ date }}
          </span>
        </div>
        <!-- Иконка date_reminder -->
        <div
          v-if="!!card.date_reminder"
          class="flex items-center space-x-0.5"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.2222 2.55556H12.8889H11.3333H4.66667H3.11111H1.77778C1.47095 2.55556 1.22222 2.80429 1.22222 3.11111V14.6667C1.22222 14.9735 1.47095 15.2222 1.77778 15.2222H14.2222C14.529 15.2222 14.7778 14.9735 14.7778 14.6667V3.11111C14.7778 2.80429 14.529 2.55556 14.2222 2.55556ZM1.77778 1.33333C0.795938 1.33333 0 2.12927 0 3.11111V14.6667C0 15.6485 0.795938 16.4444 1.77778 16.4444H14.2222C15.2041 16.4444 16 15.6485 16 14.6667V3.11111C16 2.12927 15.2041 1.33333 14.2222 1.33333H12.8889H11.3333H4.66667H3.11111H1.77778Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M9.59596 5.33333C8.98231 5.33333 8.48485 5.83079 8.48485 6.44444C8.48485 7.05809 8.98231 7.55555 9.59596 7.55555C10.2096 7.55555 10.7071 7.05809 10.7071 6.44444C10.7071 5.83079 10.2096 5.33333 9.59596 5.33333Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M9.59596 8.44444C8.98231 8.44444 8.48485 8.9419 8.48485 9.55555C8.48485 10.1692 8.98231 10.6667 9.59596 10.6667C10.2096 10.6667 10.7071 10.1692 10.7071 9.55555C10.7071 8.9419 10.2096 8.44444 9.59596 8.44444Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M8.48485 12.6667C8.48485 12.053 8.98231 11.5556 9.59596 11.5556C10.2096 11.5556 10.7071 12.053 10.7071 12.6667C10.7071 13.2803 10.2096 13.7778 9.59596 13.7778C8.98231 13.7778 8.48485 13.2803 8.48485 12.6667Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M12.7071 5.33333C12.0934 5.33333 11.596 5.83079 11.596 6.44444C11.596 7.05809 12.0934 7.55555 12.7071 7.55555C13.3207 7.55555 13.8182 7.05809 13.8182 6.44444C13.8182 5.83079 13.3207 5.33333 12.7071 5.33333Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M11.596 9.55555C11.596 8.9419 12.0934 8.44444 12.7071 8.44444C13.3207 8.44444 13.8182 8.9419 13.8182 9.55555C13.8182 10.1692 13.3207 10.6667 12.7071 10.6667C12.0934 10.6667 11.596 10.1692 11.596 9.55555Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M12.7071 11.5556C12.0934 11.5556 11.596 12.053 11.596 12.6667C11.596 13.2803 12.0934 13.7778 12.7071 13.7778C13.3207 13.7778 13.8182 13.2803 13.8182 12.6667C13.8182 12.053 13.3207 11.5556 12.7071 11.5556Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M3.41416 5.33333C2.80051 5.33333 2.30305 5.83079 2.30305 6.44444C2.30305 7.05809 2.80051 7.55555 3.41416 7.55555C4.02781 7.55555 4.52527 7.05809 4.52527 6.44444C4.52527 5.83079 4.02781 5.33333 3.41416 5.33333Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M3.41416 8.44444C2.80051 8.44444 2.30305 8.9419 2.30305 9.55555C2.30305 10.1692 2.80051 10.6667 3.41416 10.6667C4.02781 10.6667 4.52527 10.1692 4.52527 9.55555C4.52527 8.9419 4.02781 8.44444 3.41416 8.44444Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M2.30305 12.6667C2.30305 12.053 2.80051 11.5556 3.41416 11.5556C4.02781 11.5556 4.52527 12.053 4.52527 12.6667C4.52527 13.2803 4.02781 13.7778 3.41416 13.7778C2.80051 13.7778 2.30305 13.2803 2.30305 12.6667Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M6.52528 5.33333C5.91163 5.33333 5.41416 5.83079 5.41416 6.44444C5.41416 7.05809 5.91163 7.55555 6.52528 7.55555C7.13893 7.55555 7.63639 7.05809 7.63639 6.44444C7.63639 5.83079 7.13893 5.33333 6.52528 5.33333Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M5.41416 9.55555C5.41416 8.9419 5.91163 8.44444 6.52528 8.44444C7.13893 8.44444 7.63639 8.9419 7.63639 9.55555C7.63639 10.1692 7.13893 10.6667 6.52528 10.6667C5.91163 10.6667 5.41416 10.1692 5.41416 9.55555Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M6.52528 11.5556C5.91163 11.5556 5.41416 12.053 5.41416 12.6667C5.41416 13.2803 5.91163 13.7778 6.52528 13.7778C7.13893 13.7778 7.63639 13.2803 7.63639 12.6667C7.63639 12.053 7.13893 11.5556 6.52528 11.5556Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M4.66667 0.777778C4.66667 0.348223 4.31844 0 3.88889 0C3.45933 0 3.11111 0.348223 3.11111 0.777777V1.33333H4.66667V0.777778Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M3.11111 3.44444C3.11111 3.874 3.45933 4.22222 3.88889 4.22222C4.31844 4.22222 4.66667 3.874 4.66667 3.44444V2.55556H3.11111V3.44444Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M12.8889 0.777777C12.8889 0.348222 12.5407 0 12.1111 0C11.6816 0 11.3333 0.348222 11.3333 0.777776V1.33333H12.8889V0.777777Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              d="M11.3333 3.44444C11.3333 3.874 11.6816 4.22222 12.1111 4.22222C12.5407 4.22222 12.8889 3.874 12.8889 3.44445V2.55556H11.3333V3.44444Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span
            class="text-[10px] leading-[12px] text-[#7e7e80] font-['Roboto'] mx-0.5"
          >
            {{ dateToLabelFormat(new Date(card.date_reminder)) }}
          </span>
        </div>
        <div
          v-if="!!card.client_name"
          class="flex items-center space-x-0.5"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
              fill="gray"
            />
          </svg>
          <span
            class="text-[10px] leading-[12px] text-[#7e7e80] font-['Roboto'] mx-0.5 max-w-[170px] truncate"
          >
            {{ card.client_name }}
          </span>
        </div>
        <!-- выводим бюджет -->
        <div
          v-if="cost"
          class="flex items-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.25924 4.44448C3.10208 4.44448 2.95135 4.50691 2.84021 4.61805C2.72908 4.72918 2.66665 4.87991 2.66665 5.03707V10.963C2.66665 11.1202 2.72908 11.2709 2.84021 11.382C2.95135 11.4932 3.10208 11.5556 3.25924 11.5556H12.7407C12.8979 11.5556 13.0486 11.4932 13.1597 11.382C13.2709 11.2709 13.3333 11.1202 13.3333 10.963V5.03707C13.3333 4.87991 13.2709 4.72918 13.1597 4.61805C13.0486 4.50691 12.8979 4.44448 12.7407 4.44448H3.25924ZM2.00216 3.77999C2.33556 3.4466 2.78774 3.25929 3.25924 3.25929H12.7407C13.2122 3.25929 13.6644 3.4466 13.9978 3.77999C14.3312 4.11339 14.5185 4.56558 14.5185 5.03707V10.963C14.5185 11.4345 14.3312 11.8867 13.9978 12.2201C13.6644 12.5535 13.2122 12.7408 12.7407 12.7408H3.25924C2.78774 12.7408 2.33556 12.5535 2.00216 12.2201C1.66876 11.8867 1.48146 11.4345 1.48146 10.963V5.03707C1.48146 4.56558 1.66876 4.11339 2.00216 3.77999Z"
              fill="#7e7e80"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.99998 6.81485C7.34542 6.81485 6.8148 7.34548 6.8148 8.00004C6.8148 8.6546 7.34542 9.18522 7.99998 9.18522C8.65454 9.18522 9.18517 8.6546 9.18517 8.00004C9.18517 7.34548 8.65454 6.81485 7.99998 6.81485ZM5.62961 8.00004C5.62961 6.69092 6.69086 5.62967 7.99998 5.62967C9.3091 5.62967 10.3704 6.69092 10.3704 8.00004C10.3704 9.30916 9.3091 10.3704 7.99998 10.3704C6.69086 10.3704 5.62961 9.30916 5.62961 8.00004Z"
              fill="#7e7e80"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.6712 3.3044C4.89264 3.39613 5.03702 3.61221 5.03702 3.85189C5.03702 4.63771 4.72485 5.39136 4.16919 5.94702C3.61352 6.50268 2.85988 6.81485 2.07406 6.81485C1.83437 6.81485 1.61829 6.67047 1.52657 6.44903C1.43485 6.2276 1.48555 5.97271 1.65503 5.80323L4.0254 3.43286C4.19488 3.26338 4.44976 3.21268 4.6712 3.3044ZM13.9259 10.3704C13.4544 10.3704 13.0022 10.5577 12.6688 10.8911C12.3354 11.2245 12.1481 11.6767 12.1481 12.1482C12.1481 12.4755 11.8828 12.7408 11.5555 12.7408C11.2283 12.7408 10.9629 12.4755 10.9629 12.1482C10.9629 11.3624 11.2751 10.6087 11.8308 10.0531C12.3864 9.49739 13.1401 9.18522 13.9259 9.18522C14.2532 9.18522 14.5185 9.45053 14.5185 9.77781C14.5185 10.1051 14.2532 10.3704 13.9259 10.3704Z"
              fill="#7e7e80"
            />
          </svg>
          <span
            class="text-[10px] leading-[12px] text-[#7e7e80] font-['Roboto'] mx-0.5"
          >
            {{ cost }}
          </span>
        </div>
      </div>
      <!-- Иконки справа -->
      <div
        v-if="card.has_files || card.has_msgs || card.date_reminder || card.comment.length"
        class="flex items-center"
      >
        <!-- Иконка файлов -->
        <svg
          v-if="card.has_files"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.93164 12.0197C4.55274 12.6759 5.36698 13 6.18122 13C6.99546 13 7.8097 12.6719 8.43079 12.0157L12.3354 7.89047C13.2215 6.95419 13.2215 5.42973 12.3354 4.49345C11.9074 4.04131 11.3355 3.78924 10.7296 3.78924C10.1237 3.78924 9.55179 4.03731 9.12384 4.49345L5.5374 8.28258C5.0072 8.84275 5.0072 9.75903 5.5374 10.3192C6.0676 10.8794 6.93486 10.8794 7.46506 10.3192L9.82447 7.82645C10.0025 7.63839 10.0025 7.3343 9.82447 7.14624C9.64647 6.95819 9.35864 6.95819 9.18065 7.14624L6.82503 9.64299C6.64704 9.83105 6.35921 9.83105 6.18122 9.64299C6.00322 9.45494 6.00322 9.15085 6.18122 8.96279L9.76387 5.17765C10.0214 4.90557 10.3622 4.75753 10.7296 4.75753C11.0932 4.75753 11.4378 4.90557 11.6953 5.17765C12.2255 5.73782 12.2255 6.6541 11.6953 7.21426L7.78697 11.3395C6.90078 12.2758 5.45787 12.2758 4.57167 11.3395C4.14372 10.8874 3.90892 10.2832 3.90892 9.64299C3.90892 9.0028 4.14372 8.39862 4.57546 7.94648L8.47624 3.82125C8.65423 3.63319 8.65423 3.3291 8.47624 3.14104C8.29824 2.95299 8.01042 2.95299 7.83242 3.14104L3.93164 7.26628C3.32948 7.89847 3 8.74272 3 9.64299C3 10.5393 3.32948 11.3835 3.93164 12.0197Z"
            fill="#7e7e80"
          />
        </svg>
        <svg
          v-if="card.comment.length"
          class="ml-1"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5994 10.8571H8.8002C8.95314 10.8573 9.10025 10.9131 9.21147 11.0131C9.32268 11.113 9.38961 11.2497 9.39857 11.3951C9.40753 11.5405 9.35786 11.6836 9.25969 11.7953C9.16153 11.907 9.02228 11.9788 8.87041 11.996L8.8002 12H3.5994C3.44646 11.9998 3.29935 11.9441 3.18814 11.8441C3.07692 11.7441 3.01 11.6075 3.00103 11.4621C2.99207 11.3167 3.04174 11.1735 3.13991 11.0618C3.23807 10.9501 3.37732 10.8783 3.52919 10.8611L3.5994 10.8571ZM3.5994 8.57143H12.4006C12.5535 8.57159 12.7007 8.62736 12.8119 8.72734C12.9231 8.82732 12.99 8.96397 12.999 9.10937C13.0079 9.25476 12.9583 9.39793 12.8601 9.50962C12.7619 9.62131 12.6227 9.69308 12.4708 9.71029L12.4006 9.71429H3.5994C3.44646 9.71412 3.29935 9.65836 3.18814 9.55837C3.07692 9.45839 3.01 9.32174 3.00103 9.17635C2.99207 9.03095 3.04174 8.88778 3.13991 8.7761C3.23807 8.66441 3.37732 8.59263 3.52919 8.57543L3.5994 8.57143ZM3.5994 6.28571H12.4006C12.5535 6.28588 12.7007 6.34165 12.8119 6.44163C12.9231 6.54161 12.99 6.67826 12.999 6.82365C13.0079 6.96905 12.9583 7.11222 12.8601 7.2239C12.7619 7.33559 12.6227 7.40737 12.4708 7.42457L12.4006 7.42857H3.5994C3.44646 7.42841 3.29935 7.37264 3.18814 7.27266C3.07692 7.17268 3.01 7.03603 3.00103 6.89063C2.99207 6.74524 3.04174 6.60207 3.13991 6.49038C3.23807 6.37869 3.37732 6.30692 3.52919 6.28971L3.5994 6.28571ZM3.5994 4H12.4006C12.5535 4.00016 12.7007 4.05593 12.8119 4.15591C12.9231 4.2559 12.99 4.39254 12.999 4.53794C13.0079 4.68334 12.9583 4.8265 12.8601 4.93819C12.7619 5.04988 12.6227 5.12166 12.4708 5.13886L12.4006 5.14286H3.5994C3.44646 5.1427 3.29935 5.08693 3.18814 4.98694C3.07692 4.88696 3.01 4.75031 3.00103 4.60492C2.99207 4.45952 3.04174 4.31635 3.13991 4.20467C3.23807 4.09298 3.37732 4.0212 3.52919 4.004L3.5994 4Z"
            fill="#7E7E80"
          />
        </svg>
        <!-- Иконка сообщений -->
        <svg
          v-if="card.has_msgs"
          class="ml-1"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.48726 5.94928H9.51742C9.77013 5.94928 9.98295 5.73671 9.98295 5.4843C9.98295 5.23188 9.77013 5.01932 9.51742 5.01932H5.48726C5.23454 5.01932 5.02173 5.23188 5.02173 5.4843C5.02173 5.73671 5.22124 5.94928 5.48726 5.94928Z"
            fill="#7e7e80"
          />
          <path
            d="M8.17403 7.29106C8.42675 7.29106 8.63956 7.0785 8.63956 6.82609C8.63956 6.57367 8.42675 6.36111 8.17403 6.36111H5.48726C5.23454 6.36111 5.02173 6.57367 5.02173 6.82609C5.02173 7.0785 5.23454 7.29106 5.48726 7.29106H8.17403Z"
            fill="#7e7e80"
          />
          <path
            d="M11.9914 8.5V4.47464C11.9914 3.66425 11.3263 3 10.515 3H4.47639C3.66504 3 3 3.66425 3 4.47464V11.1836C3 11.3696 3.10641 11.529 3.26602 11.6087C3.33252 11.6353 3.39903 11.6486 3.46553 11.6486C3.57194 11.6486 3.67834 11.6087 3.77145 11.5423L5.66017 9.97464H10.5283C11.3263 9.97464 11.9914 9.31039 11.9914 8.5ZM5.18134 9.13768L3.93106 10.1739V4.47464C3.93106 4.18237 4.17048 3.94324 4.46309 3.94324H10.5017C10.7943 3.94324 11.0337 4.18237 11.0337 4.47464V8.5C11.0337 8.79227 10.7943 9.0314 10.5017 9.0314H5.48726C5.36755 9.0314 5.26114 9.07126 5.18134 9.13768Z"
            fill="#7e7e80"
          />
          <path
            d="M12.5367 5.68357C12.284 5.68357 12.0712 5.89614 12.0712 6.14855C12.0712 6.40097 12.284 6.61353 12.5367 6.61353C12.8293 6.61353 13.0687 6.85266 13.0687 7.14493V12.5386L12.151 11.808C12.0712 11.7415 11.9648 11.7017 11.8584 11.7017H7.16317C6.87055 11.7017 6.63113 11.4626 6.63113 11.1703V10.8382C6.63113 10.5857 6.41832 10.3732 6.1656 10.3732C5.91289 10.3732 5.70007 10.5857 5.70007 10.8382V11.1703C5.70007 11.9807 6.36512 12.6449 7.17647 12.6449H11.7121L13.2417 13.8937C13.3215 13.9601 13.4279 14 13.5343 14C13.6008 14 13.6673 13.9867 13.7338 13.9601C13.8934 13.8804 13.9998 13.721 13.9998 13.535V7.15821C14.0131 6.34783 13.3481 5.68357 12.5367 5.68357Z"
            fill="#7e7e80"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="card.user"
      class="flex items-center"
      :class="{
        'mt-2': showDate || cost || card.has_files || card.has_msgs || card.comment.length,
        'mt-[20px]': !showDate && !cost && !card.has_files && !card.has_msgs || !card.comment.length
      }"
    >
      <img
        v-if="getEmpPhotoByEmail(card.user)"
        class="w-[22px] h-[22px] rounded-[5px] border border-black/10"
        :src="getEmpPhotoByEmail(card.user)"
        alt="Avatar"
      >
      <span
        class="ml-1 text-[12px] leading-[14px] text-[#777777] font-['Roboto'] truncate"
      >
        {{ getEmpNameByEmail(card.user) }}
      </span>
    </div>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem,
    PopMenuDivider
  },
  props: {
    card: {
      type: Object,
      default: () => ({})
    },
    showDate: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      required: true
    },
    colorDots: {
      type: String,
      required: true
    }
  },
  emits: ['select', 'moveSuccess', 'moveReject', 'moveColumn', 'delete', 'moveCardToTop', 'moveCardToBottom', 'copyEmail'],
  data () {
    return {
      isCardShow: false
    }
  },
  computed: {
    getCardStyle () {
      return this.isCardShow
        ? {
            background: this.color
          }
        : {
            '--card-background-hover': this.color
          }
    },
    getDotsStyle () {
      return {
        '--dots-background': this.colorDots
      }
    },
    isArchive () {
      return (
        this.card.uid_stage === 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67' ||
        this.card.uid_stage === 'e70af5e2-6108-4c02-9a7d-f4efee78d28c'
      )
    },
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    onlineUsers () {
      const onlineUsers = []
      for (const property in this.employees) {
        if (
          this.employees[property].onlineCardUid === this.card.uid &&
          property !== this.$store.state.user.user.current_user_uid
        ) {
          onlineUsers.push(this.employees[property])
        }
      }
      if (this.selected) {
        onlineUsers.push(this.employees[this.$store.state.user.user.current_user_uid])
      }
      return onlineUsers
    },
    // делаем картинки маленькими - ограничиваем по высоте и ширине
    coverSize () {
      if (this.card.cover_size_x > 0 && this.card.cover_size_y > 0) {
        const size = { x: this.card.cover_size_x, y: this.card.cover_size_y }
        const maxWidth = 220
        const maxHeight = 220
        const ratio = size.x / size.y
        if (size.x < size.y) {
          if (size.y > maxHeight) {
            size.y = maxHeight
            size.x = Math.ceil(size.y * ratio)
          }
        } else {
          if (size.x > maxWidth) {
            size.x = maxWidth
            size.y = Math.ceil(size.x / ratio)
          }
        }
        return size
      }
      return { x: 0, y: 0 }
    },
    coverHeight () {
      if (
        this.card.uid_cover_file !== '00000000-0000-0000-0000-000000000000' &&
        this.card.cover_size_x > 0 &&
        this.card.cover_size_y > 0
      ) {
        const minCoverHeight = 40
        return minCoverHeight < this.coverSize.y
          ? this.coverSize.y
          : minCoverHeight
      } else if (this.card.cover_color && this.card.cover_color !== '#A998B6') {
        const colorHeight = 11
        return colorHeight
      }
      return 0
    },
    haveCover () {
      return this.coverHeight > 0
    },
    cost () {
      if (this.card.cost > 0) {
        const fractional = this.card.cost % 100
        const value = Math.floor(this.card.cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        if (fractional > 0) {
          const frString = (fractional < 10 ? '0' : '') + fractional
          return `${valString}.${frString}`
        }
        return valString
      }
      return ''
    },
    date () {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      let dateMoveString = this.card.date_move
      if (dateMoveString[dateMoveString.length - 1] !== 'Z') {
        dateMoveString = dateMoveString + 'Z'
      }
      const dateMove = new Date(dateMoveString)
      const dateMoveTime = dateMove.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
      dateMove.setHours(0, 0, 0, 0)

      const oneDay = 1000 * 60 * 60 * 24
      const diffInTime = today.getTime() - dateMove.getTime()
      const diffInDays = Math.round(diffInTime / oneDay)

      if (diffInDays === 0) {
        // сегодня
        return dateMoveTime
      }
      if (diffInDays === 1) {
        // вчера
        return 'Вчера'
      }
      if (diffInDays > 1 && diffInDays < 8) {
        // на неделе
        const dateMoveWeekday = dateMove.toLocaleString('default', {
          weekday: 'short'
        })
        return (
          dateMoveWeekday.slice(0, 1).toUpperCase() + dateMoveWeekday.slice(1)
        )
      }
      const month = dateMove
        .toLocaleString('default', { month: 'short' })
        .slice(0, 3)
      const dayNum = dateMove.getDate()
      const day = (dayNum < 10 ? '0' : '') + dayNum
      if (today.getFullYear() !== dateMove.getFullYear()) {
        return `${day} ${month} ${dateMove.getFullYear()}`
      }
      return `${day} ${month}`
    },
    checkIfEmailInString () {
      const regex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
      return regex.exec(this.card.name) ? regex.exec(this.card.name)[0] : ''
    }
  },
  methods: {
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const hours = String(calendarDate.getHours()).padStart(2, '0')
      const minutes = String(calendarDate.getMinutes()).padStart(2, '0')
      const time = hours === '00' && minutes === '00' ? '' : `${hours}:${minutes}`
      return `${day} ${month} ${time}`
    },
    print (val) {
      console.log(val)
    },
    selectCard () {
      this.$emit('select')
    },
    getEmpPhotoByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.fotolink ?? ''
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name || userEmail
    },
    lockVisibility (cardUid) {
      const icon = this.$refs[`card-icon-${cardUid}`]
      icon.style.visibility = 'visible'
      this.isCardShow = true
    },
    unlockVisibility (cardUid) {
      const icon = this.$refs[`card-icon-${cardUid}`]
      icon.style.visibility = null
      this.isCardShow = false
    },
    clickSuccess () {
      this.$emit('moveSuccess')
    },
    clickReject () {
      this.$emit('moveReject')
    },
    copyEmail (event) {
      if (this.checkIfEmailInString) {
        event.preventDefault()
        this.$emit('copyEmail')
      }
    },
    clickDelete () {
      this.$emit('delete')
    },
    clickMove () {
      this.$emit('moveColumn')
    },
    clickMoveToTop () {
      this.$emit('moveCardToTop')
    },
    clickMoveToBottom () {
      this.$emit('moveCardToBottom')
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgba(0, 0, 0, 0.12);
  --popper-theme-border-radius: 10px;
  --popper-theme-padding: 17px 15px;
  --popper-theme-box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
}
.board-card:hover {
  background: var(--card-background-hover);
}
.board-card-dots {
  background: var(--dots-background);
}
</style>
