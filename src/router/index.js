import { createRouter, createWebHistory } from "vue-router";

import IniCio from '../components/IniCio.vue';
import XestionPacientes from '../components/XestionPacientes.vue';
import SobreNos from '../components/SobreNos.vue';
import NotFound from '../components/NotFound.vue';
import AvisoLegal from '../components/AvisoLegal.vue';


const routes = [
    {path: '/', name: IniCio, component: IniCio},
    {path: '/xestionusuarios',  name: 'XestionPacientes', component: XestionPacientes},
    {path: '/sobrenos', name: SobreNos, component: SobreNos},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
    {path: '/avisolegal', name: 'AvisoLegal', component: AvisoLegal},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;