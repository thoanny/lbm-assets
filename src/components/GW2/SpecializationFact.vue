<template>
    <div class="flex gap-1 items-center leading-none">
        <template v-if="fact.type === 'Buff'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>
                {{ fact.status }}{{ fact.apply_count > 1 ? `×${fact.apply_count}` : ''
                }}{{ fact.duration ? ` (${fact.duration}s)` : ''
                }}{{ fact.description ? ` : ${fact.description}` : '' }}
            </span>
        </template>
        <template v-else-if="fact.type === 'PrefixedBuff'">
            <img :src="fact.prefix.icon" class="size-6 self-start" alt="" />
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>
                {{ fact.status }}{{ fact.apply_count > 1 ? `×${fact.apply_count}` : ''
                }}{{ fact.duration ? ` (${fact.duration}s)` : ''
                }}{{ fact.description ? ` : ${fact.description}` : '' }}
            </span>
        </template>
        <template v-else-if="fact.type === 'AttributeAdjust'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>
                {{ ['None', 'Healing'].indexOf(fact.target) >= 0 ? fact.text : fact.target }}&nbsp;:
                {{ fact.value }}
            </span>
        </template>
        <template v-else-if="fact.type === 'Number'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>
                {{ fact.text }}&nbsp;:
                {{ fact.value }}
            </span>
        </template>
        <template v-else-if="fact.type === 'Distance'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>
                {{ fact.text }}&nbsp;:
                {{ fact.distance }}
            </span>
        </template>
        <template v-else-if="fact.type === 'Time'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>
                {{ fact.text }}&nbsp;: {{ fact.duration }}
                {{ fact.duration > 1 ? 'secondes' : 'seconde' }}
            </span>
        </template>
        <template v-else-if="fact.type === 'Percent'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>{{ fact.text }}&nbsp;: {{ fact.percent }}%</span>
        </template>
        <template v-else-if="fact.type === 'Damage'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>{{ fact.text }}&nbsp;: &times;{{ fact.dmg_multiplier }}</span>
        </template>
        <template v-else-if="fact.type === 'Recharge'">
            <img :src="fact.icon" class="size-4 mx-1" alt="" />
            <span
                >{{ fact.text }}&nbsp;: {{ fact.value }}
                {{ fact.value > 1 ? 'secondes' : 'seconde' }}</span
            >
        </template>
        <template v-else-if="fact.type === 'NoData'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>{{ fact.text }}</span>
        </template>
        <template v-else-if="fact.type === 'Range'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>Portée&nbsp;: {{ fact.value }}</span>
        </template>
        <template v-else-if="fact.type === 'Radius'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>Rayon&nbsp;: {{ fact.distance }}</span>
        </template>
        <template v-else-if="fact.type === 'ComboField'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>Zone de combo&nbsp;: {{ fact.field_type }}</span>
        </template>
        <template v-else-if="fact.type === 'ComboFinisher'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>Combo de coup de grâce&nbsp;: {{ fact.finisher_type }}</span>
        </template>
        <template v-else-if="fact.type === 'StunBreak'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>Dissipe Étourdissement</span>
        </template>
        <template v-else-if="fact.type === 'Unblockable'">
            <img :src="fact.icon" class="size-6 self-start" alt="" />
            <span>Ne peut être bloquée</span>
        </template>
        <!-- <template v-else>
            <pre>{{ fact }}</pre>
        </template> -->
    </div>
</template>

<script setup>
defineProps(['fact']);
</script>
