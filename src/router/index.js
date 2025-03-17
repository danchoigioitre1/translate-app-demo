import { createRouter, createWebHistory } from "vue-router";
import PATH from "./path";


const routers = [
  { path: PATH.HOME.INDEX, component: () => import("@/layouts/page/home/Home.vue"), name: "ClassHomeRouter" },
  { path: PATH.SERVICE.VOICE_TRANSLATION, component: () => import("@/layouts/page/services/VoiceTranslation.vue"), name: "VoiceTranslationRouter" },
  { path: PATH.SERVICE.TEXT_TRANSLATION, component: () => import("@/layouts/page/services/TextTranslation.vue"), name: "TextTranslationRouter" },
  { path: PATH.SERVICE.VOICE_COMMUNICATION, component: () => import("@/layouts/page/services/VoiceCommunication.vue"), name: "VoiceCommunicationRouter" },
  { path: PATH.SERVICE.VOICE_COMMUNICATION_TWO_DEVICES, component: () => import("@/layouts/page/services/VoiceCommunicationTwoDevices.vue"), name: "VoiceCommunicationTwoDevicesRouter" },
  { path: PATH.SERVICE.VOICE_CALL, component: () => import("@/layouts/page/services/VoiceCall.vue"), name: "VoiceCall" },
  { path: PATH.SERVICE.VIDEO_CALL, component: () => import("@/layouts/page/services/VideoCall.vue"), name: "VideoCall" },
  // { 
  // { 
  // path: "/classroom", component: ClassHome, name: "ClassHomeRouter" },
  // {
  //   path: "/storage",
  //   component: StorageHome,
  //   name: "DocumentHomeRouter",
  //   children: [
  //     {
  //       path: "create",
  //       components: {
  //         default: StorageHome,
  //         StorageRouterView: CreateQuestion,
  //       },
  //       props: true,
  //       name: "CreateQuestionsRouter",
  //     },
  //   ],
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routers,
});

export default router;
