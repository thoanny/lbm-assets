<script setup>
import { ref } from 'vue';

/**
 * Material Icons :
 *  - weight : 200
 *  - grade : 0
 *  - optical size : 48px
 */

const DISCORDURL = 'https://discord.com'; // [ ] Mettre la bonne URL

const step = ref('home'); // [ ] Définir à "home"
const steps = ['home', 'guild-choice', 'terms', 'form', 'queue', 'queue-request', 'error'];

const communityModal = ref();
const organizedModal = ref();
const activeModal = ref();
const helloNoob = ref(false);

const goToStep = (newStep) => {
  if (steps.indexOf(newStep) < 0) {
    step.value = 'error';
    return;
  }

  step.value = newStep;
};
</script>

<template>
  <div class="bg-black bg-opacity-50 p-4 rounded-lg text-neutral-content">
    <h1 class="text-2xl font-bold text-white text-center mb-6">
      J'aimerais un ticket pour prendre le Bus&nbsp;!
    </h1>

    <div v-if="step === 'home'">
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="h-16 w-16 mx-auto"
            >
              <path
                d="M249.837-272.307q-34.683 0-58.799-24.231-24.115-24.231-24.115-58.846H90v-329.231q0-14.597 10.394-24.991T125.385-720H656l214 201.692v162.924h-64.615q0 34.615-24.278 58.846-24.279 24.231-58.962 24.231-34.683 0-58.799-24.231-24.115-24.231-24.115-58.846H333.077q0 34.461-24.278 58.769-24.279 24.308-58.962 24.308ZM570-536.923h234L642.462-689.231H570v152.308Zm-224.615 0h193.846v-152.308H345.385v152.308Zm-224.616 0h193.846v-152.308H120.769v152.308Zm129.058 236.154q22.865 0 38.827-15.788 15.961-15.788 15.961-38.654 0-22.866-15.788-38.827Q273.039-410 250.173-410q-22.865 0-38.827 15.788-15.962 15.789-15.962 38.654 0 22.866 15.789 38.828 15.788 15.961 38.654 15.961Zm472.307 0q22.866 0 38.828-15.788 15.961-15.788 15.961-38.654 0-22.866-15.788-38.827Q745.347-410 722.481-410q-22.866 0-38.827 15.788-15.962 15.789-15.962 38.654 0 22.866 15.789 38.828 15.788 15.961 38.653 15.961Zm-601.365-85.385h50.077q8.538-22.154 30.962-37.231 22.423-15.076 48.192-15.076 25.769 0 47.038 13.923 21.27 13.923 32.885 38.384h313.516q8.253-21.384 30.676-36.846 22.424-15.461 48.193-15.461t47.038 14.307q21.269 14.308 32.885 38h37v-120H120.769v120Zm718.462-120H120.769h718.462Z"
              />
            </svg>
            <h4 class="lbm-card-title">Communautaire</h4>
            <p>
              Nous sommes une guilde communautaire, basée sur l'entraide et le respect. Tous nos
              évènements sont organisés sur les serveurs européens.
            </p>
            <div class="lbm-card-actions">
              <button class="lbm-btn lbm-btn-sm" @click="communityModal.showModal()">
                Plus d'infos
              </button>
              <dialog ref="communityModal" class="lbm-modal">
                <div class="lbm-modal-box">
                  <form method="dialog">
                    <button
                      class="lbm-btn lbm-btn-sm lbm-btn-circle lbm-btn-ghost absolute right-2 top-2"
                    >
                      ✕
                    </button>
                  </form>
                  <h3 class="font-bold text-lg">Communautaire</h3>
                  <p>
                    Nous sommes une guilde communautaire, 75% des membres de notre guilde ne
                    représentent pas la guilde. Même lors de nos événements ce n'est pas obligatoire
                    (sauf pour les missions de guilde où sans représentation aucun coffre n'est
                    gagné). Tous nos évènements sont organisés sur les serveurs Européens.
                  </p>
                  <p>Nous promouvons l'entraide et le respect entre nos membres.</p>
                  <p>
                    Vous pouvez voir notre guilde comme un annuaire, une source d'information ou une
                    aide pour se retrouver.
                  </p>
                </div>
              </dialog>
            </div>
          </div>
        </div>
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="M221.538-181.538h516.924v-71.539q0-10.769-6.923-17.692t-17.692-6.923H246.153q-10.769 0-17.692 6.923t-6.923 17.692v71.539Zm107.385-126.924h302.154l-27.846-196.153H356.769l-27.846 196.153ZM190.769-150.769v-102.308q0-22.25 16.567-38.817 16.567-16.568 38.817-16.568h52.001l28.615-196.153h-91.385v-30.77h489.232v30.77h-91.385l28.615 196.153h51.82q22.623 0 39.094 16.568 16.471 16.567 16.471 38.817v102.308H190.769Zm134.538-384.616-60.692-273.846q27.154 20 52.664 27.654 25.509 7.654 53.828 7.654 31.201 0 58.778-8.693Q457.461-791.308 480-810q22.539 18.692 49.767 27.384 27.228 8.693 58.772 8.693 25.461 0 50.269-6.885t57.346-28.423l-61.461 273.846h-32.001l49.077-218.384q-19.077 5.307-36.269 8.077-17.192 2.769-32.731 2.769-27.824 0-53.758-6.654T480-770.077q-23.077 13.846-49.64 20.5-26.564 6.654-54.668 6.654-14.769 0-31.192-2.385-16.423-2.384-34.731-6.923l47.539 216.846h-32.001ZM480-504.615Zm.769-30.77ZM480-181.538Z"
              />
            </svg>
            <h4 class="lbm-card-title">Organisée</h4>
            <p>
              Nous organisons des événements pour lesquels souvent, vous n'avez pas besoin de faire
              partie de la guilde.
            </p>
            <div class="lbm-card-actions">
              <button class="lbm-btn lbm-btn-sm" @click="organizedModal.showModal()">
                Plus d'infos
              </button>
              <dialog ref="organizedModal" class="lbm-modal">
                <div class="lbm-modal-box">
                  <form method="dialog">
                    <button
                      class="lbm-btn lbm-btn-sm lbm-btn-circle lbm-btn-ghost absolute right-2 top-2"
                    >
                      ✕
                    </button>
                  </form>
                  <h3 class="font-bold text-lg">Organisée</h3>
                  <p>TODO</p>
                </div>
              </dialog>
            </div>
          </div>
        </div>
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="m408.385-201.154 240.538-288.077H479.692l32.154-254.462-216.077 312.924h145.539l-32.923 229.615Zm-42.231 76.539 40-275.385H236.153l299.232-431.539h18.461L514.616-520h200L384.615-124.615h-18.461Zm106.308-348.308Z"
              />
            </svg>
            <h4 class="lbm-card-title">Active</h4>
            <p>
              Nous sommes une guilde très active et vous êtes assuré d'avoir réponse à vos questions
              en utilisant le canal guilde.
            </p>
            <div class="lbm-card-actions">
              <button class="lbm-btn lbm-btn-sm" @click="activeModal.showModal()">
                Plus d'infos
              </button>
              <dialog ref="activeModal" class="lbm-modal">
                <div class="lbm-modal-box">
                  <form method="dialog">
                    <button
                      class="lbm-btn lbm-btn-sm lbm-btn-circle lbm-btn-ghost absolute right-2 top-2"
                    >
                      ✕
                    </button>
                  </form>
                  <h3 class="font-bold text-lg">Active</h3>
                  <p>TODO</p>
                </div>
              </dialog>
            </div>
          </div>
        </div>
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="M215.384-120q-23.057 0-39.221-16.163Q160-152.327 160-175.384v-538.462q0-23.058 16.163-39.222 16.164-16.163 39.221-16.163h82.693v-80h35.769v80h295.385v-80h33.462v80h81.923q23.057 0 39.221 16.163Q800-736.904 800-713.846v538.462q0 23.057-16.163 39.221Q767.673-120 744.616-120H215.384Zm0-30.769h529.232q9.23 0 16.923-7.692 7.692-7.693 7.692-16.923V-540H190.769v364.616q0 9.23 7.692 16.923 7.693 7.692 16.923 7.692ZM190.769-570.77h578.462v-143.076q0-9.231-7.692-16.923-7.693-7.693-16.923-7.693H215.384q-9.23 0-16.923 7.693-7.692 7.692-7.692 16.923v143.076Zm0 0v-167.692 167.692ZM480-393.846q-12.385 0-21.577-9.193-9.192-9.192-9.192-21.576 0-12.385 9.192-21.577 9.192-9.193 21.577-9.193 12.385 0 21.577 9.193 9.192 9.192 9.192 21.577 0 12.384-9.192 21.576-9.192 9.193-21.577 9.193Zm-160 0q-12.385 0-21.577-9.193-9.192-9.192-9.192-21.576 0-12.385 9.192-21.577 9.192-9.193 21.577-9.193 12.385 0 21.577 9.193 9.192 9.192 9.192 21.577 0 12.384-9.192 21.576-9.192 9.193-21.577 9.193Zm320 0q-12.385 0-21.577-9.193-9.192-9.192-9.192-21.576 0-12.385 9.192-21.577 9.192-9.193 21.577-9.193 12.385 0 21.577 9.193 9.192 9.192 9.192 21.577 0 12.384-9.192 21.576-9.192 9.193-21.577 9.193ZM480-240q-12.385 0-21.577-9.192-9.192-9.193-9.192-21.577 0-12.385 9.192-21.577 9.192-9.193 21.577-9.193 12.385 0 21.577 9.193 9.192 9.192 9.192 21.577 0 12.384-9.192 21.577Q492.385-240 480-240Zm-160 0q-12.385 0-21.577-9.192-9.192-9.193-9.192-21.577 0-12.385 9.192-21.577 9.192-9.193 21.577-9.193 12.385 0 21.577 9.193 9.192 9.192 9.192 21.577 0 12.384-9.192 21.577Q332.385-240 320-240Zm320 0q-12.385 0-21.577-9.192-9.192-9.193-9.192-21.577 0-12.385 9.192-21.577 9.192-9.193 21.577-9.193 12.385 0 21.577 9.193 9.192 9.192 9.192 21.577 0 12.384-9.192 21.577Q652.385-240 640-240Z"
              />
            </svg>
            <h4 class="lbm-card-title">Calendrier des événements</h4>
            <p>
              Tous nos événements sont planifiés et vous pouvez vous y inscrire sur notre Discord.
            </p>
          </div>
        </div>
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="M481.231-104.615v-30.769h263.385q10.769 0 17.692-6.923T769.231-160v-37.077H652v-235.231h117.231v-86.461q0-120.154-84.133-205.423-84.133-85.27-204.077-85.27t-205.098 85.27q-85.154 85.269-85.154 205.423v86.461H308v235.231h-92.616q-23.057 0-39.221-16.163Q160-229.404 160-252.461v-266.308q0-66.271 25.038-124.936 25.039-58.665 68.654-102.634 43.616-43.968 102.512-68.93 58.897-24.962 125.231-24.962t124.527 25.038q58.192 25.039 101.244 68.755 43.051 43.716 67.923 102.557Q800-585.04 800-518.769V-160q0 23.058-16.163 39.222-16.164 16.163-39.221 16.163H481.231ZM215.384-227.846h61.847v-173.692h-86.462v149.077q0 10 6.923 17.307 6.923 7.308 17.692 7.308Zm467.385 0h86.462v-173.692h-86.462v173.692ZM215.384-401.538H190.769h86.462-61.847Zm467.385 0h86.462-86.462Z"
              />
            </svg>
            <h4 class="lbm-card-title">Discussions vocales</h4>
            <p>
              Rejoignez <a :href="DISCORDURL" target="_blank">notre serveur Discord</a> pour
              discuter de vive voix lors de nos événements.
            </p>
          </div>
        </div>
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="M756.692-128.769 631.154-254.307l-88 88-17.616-18.385q-16.23-15.462-16.23-38.154 0-22.692 16.23-38.923L703-439.231q15.462-15.461 38.154-15.461 22.692 0 38.923 15.461l17.616 18.385-88 88L835-207.308q8.231 8.231 8.231 19.462T835-168.385l-39.385 39.616q-8.23 9-19.461 9-11.231 0-19.462-9ZM840-740.923 398.539-298.692l36.692 36.154q15.461 16.23 15.461 38.923 0 22.692-15.461 38.154l-18.385 18.384-88-88-125.538 125.539q-8.231 9-19.462 9t-19.461-9l-39.616-39.616q-9-8.231-9-19.461 0-11.231 9-19.462l125.538-125.538-88-88L180.692-440q15.462-15.462 38.154-15.462 22.692 0 38.923 15.462l36.923 37.461L736.923-844H840v103.077ZM327.692-576.461l29.539-30.308 30.308-30.308-30.308 30.308-29.539 30.308Zm-22 22L120-740.923V-844h103.077L408-658.308l-20.461 21.231-177.154-176.154h-59.616v59.616l176.923 177.154-22 22Zm70.385 233.538 433.154-432.692v-59.616h-59.616L316.461-381.308l59.616 60.385Zm0 0L346.769-352l-30.308-29.308L346.769-352l29.308 31.077Z"
              />
            </svg>
            <h4 class="lbm-card-title">Devenir organisateur</h4>
            <p>
              Si vous souhaitez monter à bord du Bus pour organiser des événements avec les joueuses
              et joueurs de GW2,
              <a
                href="https://www.lebusmagique.fr/pages/infos/rejoindre-le-staff.html"
                target="_blank"
                >cliquez ici</a
              >.
            </p>
          </div>
        </div>
      </div>
      <div class="flex gap-4 flex-col items-center">
        <button class="lbm-btn lbm-btn-primary" @click="goToStep('guild-choice')">
          Rejoindre le Bus Magique
        </button>
        <a href="#!" @click.prevent="goToStep('queue-request')" class="text-sm font-semibold">
          Où en est mon ticket&nbsp;?
        </a>
      </div>
    </div>

    <div v-else-if="step === 'guild-choice'">
      <div class="grid grid-cols-2 max-w-lg gap-4 mx-auto mb-6">
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="M285.923-160q-6.808 0-11.827-3.74-5.019-3.741-5.019-10.183V-251q-24.385-6-46.731-36.419Q200-317.838 200-355.615V-728q0-58.438 67.253-85.219Q334.507-840 480.206-840q148.333 0 214.063 26.288Q760-787.423 760-728v372.385q0 37.777-22.346 68.196Q715.308-257 690.923-251v77.077q0 6.442-5.019 10.183-5.019 3.74-11.827 3.74h1q-7.808 0-12.827-3.74-5.019-3.741-5.019-10.183v-67.308H302.769v67.308q0 6.442-5.019 10.183-5.019 3.74-12.827 3.74h1Zm194.308-580.154h252.077-505.385 253.308ZM648-475.615H230.769h498.462H648Zm-417.231-30.77h498.462v-203H230.769v203ZM334.009-332q17.57 0 29.588-12.199t12.018-29.769q0-17.57-12.199-30.109-12.199-12.538-29.769-12.538t-30.109 12.719Q291-391.176 291-373.606t12.719 29.588Q316.439-332 334.009-332Zm292.344 0q17.57 0 30.109-12.199Q669-356.398 669-373.968t-12.719-30.109q-12.72-12.538-30.29-12.538t-29.588 12.719q-12.018 12.72-12.018 30.29t12.199 29.588Q608.783-332 626.353-332Zm-399.43-408.154h505.385q-14.77-35.231-77-52.154-62.231-16.923-175.077-16.923-122.616 0-182.923 16.192-60.308 16.193-70.385 52.885ZM312-272h336q34.231 0 57.731-25.077t23.5-58.538v-120H230.769v120q0 33.461 23.5 58.538Q277.769-272 312-272Z"
              />
            </svg>
            <h4 class="lbm-card-title">Guilde JcE</h4>
            <p class="m-0 -mt-2 font-semibold">Le Bus Magique</p>
            <p>Notre guilde JcE pour participer à la vie communautaire en jeu.</p>
            <div class="lbm-card-actions">
              <button class="lbm-btn lbm-btn-primary" @click="goToStep('terms')">Rejoindre</button>
            </div>
          </div>
        </div>
        <div class="lbm-card">
          <div class="lbm-card-body">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
              fill="currentColor"
              class="w-16 h-16 mx-auto"
            >
              <path
                d="M60-140v-129.846l80-80v-264.923l-80-80V-820h30.77v80H220v-80h30.769v80H380v-80h30.769v125.231l-80 80v84h298.462v-84l-80-80V-820H580v80h129.231v-80H740v80h129.231v-80H900v125.231l-80 80v264.923l80 80V-140H584.615v-100q0-43.173-30.765-73.894-30.765-30.721-74-30.721T406-313.894Q375.385-283.173 375.385-240v100H60Zm30.77-30.769h253.845V-240q0-56.846 39.77-96.115 39.769-39.27 95.615-39.27 56.846 0 96.115 39.27 39.27 39.269 39.27 96.115v69.231h253.846v-86.385l-80-80v-290.308L871-709.231H578.231L660-627.462V-500H300v-127.462l81.769-81.769H89l81.769 81.769v290.308l-80 80v86.385ZM480-440Z"
              />
            </svg>
            <h4 class="lbm-card-title">Guilde McM</h4>
            <p class="m-0 -mt-2 font-semibold">Le Bus Magique II</p>
            <p>Pour les activités en McM, nous avons créé une guilde dédiée.</p>
            <div class="lbm-card-actions">
              <button class="lbm-btn lbm-btn-primary" @click="goToStep('form')">Rejoindre</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="step === 'terms'">
      <h2 class="text-lg">Système de purge</h2>
      <p>
        En entrant dans la guilde, vous aurez le rôle
        <strong>«&nbsp;ticket validé&nbsp;».</strong> Après une certaine période, vous serez dégradé
        en
        <strong
          >«&nbsp;ticket neuf&nbsp;». Participez régulièrement aux événements de guilde</strong
        >
        du Bus Magique pour valider votre ticket.
      </p>
      <p>
        Vous pouvez <strong>participer aux événements</strong> du Bus Magique (hors missions de
        guilde), <strong>sans avoir à rejoindre la guilde,</strong> uniquement en étant inscrit·e à
        l'événement et présent·e sur Discord au moment où ils se déroulent.
      </p>
      <p>
        Si vous <strong>n'êtes pas actives/actifs</strong> pendant la période où vous êtes «ticket
        neuf», <strong>vous descendrez du Bus.</strong>
      </p>
      <p>
        <strong>Ce n'est pas un banissement,</strong> c'est uniquement pour faire de la place à
        d'autres joueues/joueurs, puisque nous sommes limiés à 500 membres.
        <strong>Pour rejoindre à nouveau</strong> le Bus Magique, il vous suffit de
        <strong>refaire une demande</strong> pour remonter à bord du Bus.
      </p>

      <div class="lbm-form-control mb-4">
        <label class="lbm-label cursor-pointer justify-center gap-2">
          <input type="checkbox" class="lbm-checkbox lbm-checkbox-success" v-model="helloNoob" />
          <span class="lbm-label-text">Je n'ai pas compris le fonctionnement de la purge</span>
        </label>
      </div>
      <div class="flex justify-center mb-4">
        <button class="lbm-btn lbm-btn-primary" @click="goToStep('form')" :disabled="helloNoob">
          Obtenir un billet
        </button>
      </div>
    </div>

    <div v-else-if="step === 'form'">
      <div class="max-w-md mx-auto">
        <label class="lbm-form-control w-full">
          <div class="lbm-label">
            <span class="lbm-label-text">Clé API Guild Wars 2</span>
          </div>
          <input type="text" placeholder="" class="lbm-input lbm-input-bordered w-full" />
          <div class="lbm-label">
            <span class="lbm-label-text-alt"
              >La clé API est utilisée pour obtenir l'orthographe exacte de ton nom de compte pour
              t'envoyer l'invitation en jeu.<br />
              <a href="https://account.arena.net/applications/create" target="_blank">
                Créer une clé API
              </a>
              (autorisation "account" uniquement).</span
            >
          </div>
        </label>

        <label class="lbm-form-control w-full">
          <div class="lbm-label">
            <span class="lbm-label-text">Adresse e-mail</span>
          </div>
          <input type="text" placeholder="" class="lbm-input lbm-input-bordered w-full" />
          <div class="lbm-label">
            <span class="lbm-label-text-alt"
              >Vous recevez une notification par e-mail lorsque nous vous aurons envoyé une
              invitation en jeu. Cette adresse n'est pas conservée à l'issue de l'invitation.</span
            >
          </div>
        </label>
      </div>
      <div class="mt-6 mb-4 flex justify-center">
        <button class="lbm-btn lbm-btn-primary" @click="goToStep('queue')">
          Envoyer ma demande
        </button>
      </div>
    </div>

    <div v-else-if="step === 'queue'">
      <div class="text-center max-w-lg mx-auto">
        <div class="text-lg">Votre position<br />dans la file d'atente&nbsp;:</div>
        <div class="text-3xl font-bold">
          99
          <!-- TODO -->
        </div>
        <p class="text-sm">
          En attendant votre invitation, rejoignez
          <a :href="DISCORDURL" target="_blank">notre serveur Discord</a> pour discuter avec la
          communauté, poser vos questions et participer à nos événements qui sont ouverts à toutes
          et à tous&nbsp;!
        </p>
      </div>
      <div class="flex gap-2 justify-center mt-6 mb-4">
        <button class="lbm-btn lbm-btn-primary" @click="goToStep('home')">
          Retourner à l'accueil
        </button>
      </div>
    </div>

    <div v-else-if="step === 'queue-request'">
      Queue request
      <button class="lbm-btn" @click="goToStep('queue')">Suivant</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/main.scss';

a {
  color: white;
}

.lbm-card {
  @apply lbm-card-compact bg-base-100;

  &-body {
    @apply text-center;
  }

  &-title {
    @apply justify-center text-center;
  }

  &-actions {
    @apply justify-center;
  }
}

.lbm-label-text {
  @apply font-semibold;
}
</style>
