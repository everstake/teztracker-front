<template>
    <div class="accordion">
        <div
                class="accordion-item"
                v-for="(content, i) in contents"
                v-bind:class="{ 'accordion-active': content.active }"
        >
            <div v-if="!content.link" class="accordion-header">
                <a href="#" v-on:click="expand($event, i)">
                    <div v-if="!content.link" class="accordion-header-div">{{ content.title }}</div>

                    <div v-show="content.isExpandable" class="accordion-header-div">
                        <div class="accordion-caret"></div>
                    </div>
                </a>
            </div>

            <div  v-if="content.link" class="accordion-header">
                <a href="#" @click="goToByName(content.link)">
                    <div v-if="content.link"  class="accordion-header-div">{{ content.title }}</div>
                    <div v-show="content.isExpandable" class="accordion-header-div">
                        <div class="accordion-caret"></div>
                    </div>
                </a>
            </div>


            <div v-if="content.isExpandable" class="accordion-body" :ref="'accordion-body-' + i">
                <div  class="accordion-content" v-for="(link, i) in content.description"  :key="i">
                    <div v-if="!link.customCallback" @click="goToByName(link.routeName)" >{{ link.title }}</div>
                    <div v-else @click="link.customCallback()" >{{ link.title }}</div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import { TweenLite, Power2} from "gsap";

    export default {

        methods: {
            goToByName(name) {
                return this.$router.push({
                    name: name
                });
            },
            useMainNet() {
                window.location = "/mainnet";
            },
            useBabylon() {
                window.location = "/babylonnet";
            },
            useCarthage() {
                window.location = "/carthage";
            },

            expand: function(e, i) {
                console.log('CLICKED', this.$refs, i);


                let el = this.$refs['accordion-body-' + i][0];

                if(this.contents[i].isExpandable) {
                    if (this.contents[i].active === false) {
                        this.contents[i].active = true;

                        TweenLite.to(el, .35, {
                            height: el.scrollHeight,
                            ease: Power2.easeIn
                        });
                    } else {
                        this.contents[i].active = false;

                        TweenLite.to(el, 0.25, {
                            height: 0,
                            ease: Power2.easeInOut
                        });
                    }
                }


            }
        },


        data() {
        return {
            contents: [
                {
                    title: 'Dashboard',
                    active: false,
                    isExpandable: false,
                    link: 'index'
                },
                {
                title: 'Blocks',
                description: [
                    {
                        title: 'Blocks',
                        routeName: 'blocks'
                    },
                    {
                        title: 'Snapshots',
                        routeName: 'snapshots'
                    },
                    {
                        title: 'Baking Rights',
                        routeName: 'baking_rights'
                    }
                ],
                active: false,
                isExpandable: true
                },
                {
                    title: 'Operations',
                    active: false,
                    isExpandable: true,
                    description: [
                        {
                            title: 'Transactions',
                            routeName: 'txs'
                        },
                        {
                            title: 'Endorsements',
                            routeName: 'endorsements'
                        },
                        {
                            title: 'Delegations',
                            routeName: 'delegations'
                        },
                        {
                            title: 'Originations',
                            routeName: 'originations'
                        },
                        {
                            title: 'Activations',
                            routeName: 'activations'
                        },
                        {
                            title: 'Double-baking',
                            routeName:'double_baking'
                        },
                        {
                            title: 'Double-endorsement',
                            routeName:'double_endorsement'
                        }

                    ],
                },
                {
                    title: 'Bakers',
                    active: false,
                    isExpandable: false,
                    link: 'bakers'
                },
                {
                    title: 'Accounts',
                    active: false,
                    isExpandable: true,
                    description: [
                        {
                            title: 'Accounts',
                            routeName: 'accounts'
                        },
                        {
                            title: 'Contracts',
                            routeName: 'contracts'
                        },
                    ]
                },
                {
                    title: 'Current Network',
                    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    active: false,
                    isExpandable: true,
                    description: [
                        {
                            title: 'Mainnet',
                            customCallback: this.useMainNet
                        },
                        {
                            title: 'Babylon',
                            customCallback: this.useBabylon
                        },
                        {
                            title: 'Carthage',
                            customCallback: this.useCarthage
                        },
                    ],
                },
            ],
        }
    }
}
</script>

<style lang="scss">
    $base-color: #727272;
    $base-width: 320px;
    $base-time: 200ms;

    $app-background-color: #82dfff;
    $app-padding: 2rem;

    $accordion-background-color: #ffffff;
    $accordion-max-width: $base-width;
    $accordion-padding: 2rem 1rem;
    $accordion-border-radius: 0.5rem;
    $accordion-box-shadow: 0;

    $accordion-header-font-size: 14px;
    $accordion-header-height: 2rem;
    $accordion-header-padding: 1rem 1rem 1rem 1rem;
    $accordion-header-border-radius: 0.6rem;
    $accordion-header-transition: background-color $base-time ease-in-out;

    $accordion-header-hover-background-color: #efefef;

    $accordion-caret-color: $base-color;
    $accordion-caret-background-image: linear-gradient(
                    to top right,
                    transparent 50%,
                    $accordion-caret-color 50%
    );
    $accordion-caret-width: 0.5rem;
    $accordion-caret-height: 0.5rem;
    $accordion-caret-transform: rotate(-45deg);
    $accordion-caret-transforming: scale(1.5) rotate(45deg);
    $accordion-caret-active-transform: rotate(135deg);

    $accordion-body-content-padding: 1rem 0rem 1rem 1.4rem;




    .accordion {
        background-color: $accordion-background-color;
        width: 100%;
        max-height: 100%;
        max-width: $accordion-max-width;
        padding: $accordion-padding;
        margin: auto;
        box-sizing: border-box;
        overflow: auto;
        box-shadow: $accordion-box-shadow;
    }

    .accordion-item.accordion-active {
        .accordion-caret {
            animation: accordion-is-active $base-time linear forwards;
        }
    }

    .accordion-header {
        color: inherit;
        font-size: $accordion-header-font-size;
        font-weight: normal;
        position: relative;
        a {
            color: inherit;
            text-decoration: none;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            border-radius: $accordion-header-border-radius;
            transition: $accordion-header-transition;
            &:not(.accordion-active):hover {
                background-color: $accordion-header-hover-background-color;
            }
        }
    }

    .accordion-header-div {
        padding: $accordion-header-padding;
        &:last-child {
            padding-left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .accordion-caret {
        background-image: $accordion-caret-background-image;
        width: $accordion-caret-width;
        height: $accordion-caret-height;
        transform: $accordion-caret-transform;
        animation: accordion-is-inactive $base-time linear forwards;
    }

    .accordion-body {
        height: 0;
        overflow: hidden;
    }

    .accordion-content {
        padding: $accordion-body-content-padding;
        margin: 0 0 0 1rem ;
        justify-content: space-between;
        box-sizing: border-box;
        border-radius: $accordion-header-border-radius;
        transition: $accordion-header-transition;
        cursor: pointer;
        &:not(.accordion-active):hover {
            background-color: $accordion-header-hover-background-color;
        }
    }

    @keyframes accordion-is-inactive {
        0%   { transform: $accordion-caret-transform; }
        50%  { transform: $accordion-caret-transforming; }
        100% { transform: $accordion-caret-active-transform; }
    }

    @keyframes accordion-is-active {
        0%   { transform: $accordion-caret-active-transform; }
        50%  { transform: $accordion-caret-transforming; }
        100% { transform: $accordion-caret-transform; }
    }

    @media screen and (min-width: $base-width) {
        .accordion {
            max-height: none;
            border-radius: $accordion-border-radius;
        }

    }
</style>
