<template>
  <div
    id="sidenav-collapse-main"
    class="collapse navbar-collapse w-auto h-auto h-100"
  >
    <ul class="navbar-nav">
      <!-- <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          PROJECTS
        </h6>
      </li> -->
      <li class="nav-item ">
        <sidenav-collapse
          collapse-ref="pagesExamples"
          nav-text="IP"
          :class="getRoute() === 'pages' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-archive-2 text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <!-- <sidenav-item
                    :to="{ name: 'Order List' }"
                    mini-icon="O"
                    text="IP List"
                  /> -->
                  <sidenav-item
                    :to="{ name: 'New Project' }"
                    mini-icon="N"
                    text="新建IP"
                  />
                  <sidenav-item
                    :to="{ name: 'All Projects' }"
                    mini-icon="P"
                    text="IP视图"
                  />
                  <el-menu
                    class="nav-link "
                    style="border:none"
                    :unique-opened=true
                  >
                    <el-sub-menu index="0" >
                      <template #title>
                        <span class="sidenav-normal">按芯片</span>
                      </template>
                      <el-sub-menu v-for="(item,idx) in allProjectListVuex" :key=idx :index="'0-'+idx.toString()" >
                        <template #title >
                          <span class="sidenav-normal">
                            {{item.project}}
                          </span>
                        </template>
                        <el-menu-item v-for = "(Name,index) in item.versionList" :key=index :index="'0-'+idx.toString()+'-'+index" @click="jumpProjectIPList(Name.project_uuid,Name.projectName)">{{Name.projectName.charAt(Name.projectName.length-1)}}</el-menu-item>
                      </el-sub-menu>   
                    </el-sub-menu> 
                  </el-menu>
                  <el-menu
                    class="nav-link "
                    style="border:none"
                    :unique-opened=true
                  >
                  <!-- @open="handleOpen"
                    @close="handleClose" -->
                    <el-sub-menu index="0" >
                      <template #title>
                        <span class="sidenav-normal">按IP</span>
                      </template>
                      <el-sub-menu v-for="(item,idx) in allCategoryListVuex" :key=idx :index="'0-'+idx.toString()" >
                        <template #title >
                          <span class="sidenav-normal">
                            {{item.category}}
                          </span>
                        </template>
                        <el-menu-item v-for = "(Name,index) in item.versionList" :key=index :index="'0-'+idx.toString()+'-'+index" @click="jumpIPList(item.category,Name.ipName)">{{Name.ipName}}</el-menu-item>
                      </el-sub-menu>   
                      <!-- <el-menu-item-group title="Group Two">
                        <el-menu-item index="1-3">item three</el-menu-item>
                      </el-menu-item-group>
                      <el-sub-menu index="1-4">
                        <template #title>item four</template>
                        <el-menu-item index="1-4-1">item one</el-menu-item>
                      </el-sub-menu>-->
                    </el-sub-menu> 
                  </el-menu>

                  <!-- <sidenav-item
                    :to="{ name: 'All Projects' }"
                    mini-icon="A"
                    text="All Projects"
                  /> -->
                  

                  <!-- <sidenav-item
                    :to="{ name: 'General' }"
                    mini-icon="G"
                    text="Reg Gather List"
                  /> -->
                  <!-- <sidenav-item
                    :to="{ name: 'Charts' }"
                    mini-icon="C"
                    text="Reg Location"
                  /> -->
                  <!-- <sidenav-item
                    :to="{ name: 'Timeline' }"
                    mini-icon="T"
                    text="Timeline"
                  /> -->
              <!-- nav links -->
              <!-- <sidenav-collapse-item
                refer="profileExample"
                mini-icon="P"
                text="Profile"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Profile Overview' }"
                    mini-icon="P"
                    text="Profile Overview"
                  />
                  <sidenav-item
                    :to="{ name: 'Teams' }"
                    mini-icon="T"
                    text="Teams"
                  />

                </template>
              </sidenav-collapse-item> -->

              <!-- <sidenav-collapse-item
                refer="usersExample"
                mini-icon="U"
                text="Users"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Reports' }"
                    mini-icon="R"
                    text="Reports"
                  />
                  <sidenav-item
                    :to="{ name: 'New User' }"
                    mini-icon="N"
                    text="New User"
                  />
                </template>
              </sidenav-collapse-item> -->

              <!-- <sidenav-collapse-item
                refer="accountExample"
                mini-icon="A"
                text="Account"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Settings' }"
                    mini-icon="S"
                    text="Settings"
                  />
                  <sidenav-item
                    :to="{ name: 'Billing' }"
                    mini-icon="B"
                    text="Billing"
                  />
                  <sidenav-item
                    :to="{ name: 'Invoice' }"
                    mini-icon="I"
                    text="Invoice"
                  />
                  <sidenav-item
                    :to="{ name: 'Security' }"
                    mini-icon="S"
                    text="Security"
                  />
                </template>
              </sidenav-collapse-item> -->

              <!-- <sidenav-collapse-item
                refer="projectsExample"
                mini-icon="P"
                text="Projects"
              >
                <template #nav-child-item>
                  
                </template>
              </sidenav-collapse-item> -->
              <!-- <sidenav-item
                :to="{ name: 'Widgets' }"
                mini-icon="W"
                text="Widgets"
              /> -->

              <!-- <sidenav-item
                :to="{ name: 'Sweet Alerts' }"
                mini-icon="S"
                text="Sweet Alerts"
              />
              <sidenav-item
                :to="{ name: 'Notifications' }"
                mini-icon="N"
                text="Notifications"
              /> -->
            </ul>
          </template>
        </sidenav-collapse>
      </li>
       <!--<li class="nav-item">
        <sidenav-collapse
          collapse-ref="applicationsExamples"
          nav-text="用户管理"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-ui-04 text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'Signup Illustration' }"
                mini-icon="I"
                text="Sign Up"
              /> -->


             <!-- <sidenav-item
                :to="{ name: 'Kanban' }"
                mini-icon="K"
                text="Kanban"
              /> -->
              <!-- <sidenav-item
                :to="{ name: 'New User' }"
                mini-icon="N"
                text="New User"
              /> -->
               <!-- <sidenav-item
                :to="{ name: 'Wizard' }"
                mini-icon="W"
                text="Wizard"
              />

              <sidenav-item
                :to="{ name: 'Calendar' }"
                mini-icon="C"
                text="Calendar"
              />
              <sidenav-item
                :to="{ name: 'Analytics' }"
                mini-icon="A"
                text="Analytics"
              />
            </ul>
          </template> 
        </sidenav-collapse>
      </li>-->
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="applicationsExamples"
          nav-text="模版"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-ui-04 text-info text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                :to="{ name: 'Products List' }"
                mini-icon="P"
                text="Spec模版管理"
              />
              <sidenav-item
                :to="{ name: 'Data Tables' }"
                mini-icon="D"
                text="项目列表"
              />
              <sidenav-item
                :to="{ name: 'Kanban' }"
                mini-icon="C"
                text="类别管理"
              />
              <sidenav-item
                :to="{ name: 'Wizard' }"
                mini-icon="W"
                text="版本变更日志"
              />
              <!-- sidenav-item
                :to="{ name: 'Data Tables' }"
                mini-icon="D"
                text="Data Tables"
              />
              <sidenav-item
                :to="{ name: 'Calendar' }"
                mini-icon="C"
                text="Calendar"
              />
              <sidenav-item
                :to="{ name: 'Analytics' }"
                mini-icon="A"
                text="Analytics"
              />-->
            </ul>
          </template>
        </sidenav-collapse>
      </li> 
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="dashboardsExamples"
          nav-text="用户管理"
          :class="getRoute() === 'dashboards' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-shop text-primary text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <!-- <sidenav-item
                :to="{ name: 'Reset Illustration' }"
                mini-icon="I"
                text="重置密码"
              /> -->
              <sidenav-item
                :to="{ name: 'Reports' }"
                mini-icon="R"
                text="用户列表"
              />
              <!--<sidenav-item
                :to="{ name: 'Landing' }"
                mini-icon="L"
                text="Landing"
              />
              <sidenav-item
                :to="{ name: 'Default' }"
                mini-icon="D"
                text="Default"
              />
              <sidenav-item
                :to="{ name: 'Automotive' }"
                mini-icon="A"
                text="Automotive"
              />
              <sidenav-item
                :to="{ name: 'Smart Home' }"
                mini-icon="S"
                text="Smart Home"
              />
              <sidenav-item :to="{ name: 'CRM' }" mini-icon="C" text="CRM" /> -->
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <!--<li class="nav-item">
        <sidenav-collapse
          collapse-ref="ecommerceExamples"
          nav-text="日志管理"
          :class="getRoute() === 'ecommerce' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-archive-2 text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">

               <sidenav-item
                :to="{ name: 'Overview' }"
                mini-icon="O"
                text="Overview"
              />

              <sidenav-collapse-item
                refer="productsExample"
                mini-icon="P"
                text="Products"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'New Product' }"
                    mini-icon="N"
                    text="New Product"
                  />
                  <sidenav-item
                    :to="{ name: 'Edit Product' }"
                    mini-icon="E"
                    text="Edit Product"
                  />
                  <sidenav-item
                    :to="{ name: 'Product Page' }"
                    mini-icon="P"
                    text="Product page"
                  />
                  <sidenav-item
                    :to="{ name: 'Products List' }"
                    mini-icon="P"
                    text="Products List"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="ordersExample"
                mini-icon="O"
                text="Orders"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Order Details' }"
                    mini-icon="O"
                    text="Order Details"
                  />
                </template>
              </sidenav-collapse-item>

            </ul>
          </template>
        </sidenav-collapse>
      </li> -->

       <li class="nav-item">
        <sidenav-collapse
          collapse-ref="authExamples"
          nav-text="日志管理"
          :class="getRoute() === 'authentication' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-item
                  :to="{ name: 'ModifyLog' }"
                  mini-icon="M"
                  text="操作日志"
                />
              <sidenav-item
                :to="{ name: 'Pattern Info' }"
                mini-icon="R"
                text="Pattern日志"
              />
              <!--<sidenav-collapse-item
                refer="signinExample"
                mini-icon="S"
                text="Sign In"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Signin Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Signin Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Signin Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="signupExample"
                mini-icon="S"
                text="Sign Up"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Signup Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Signup Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Signup Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="resetExample"
                mini-icon="R"
                text="Reset Password"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Reset Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Reset Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Reset Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="lockExample"
                mini-icon="L"
                text="Lock"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Lock Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Lock Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Lock Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="StepExample"
                mini-icon="2"
                text="2-Step Verification"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Verification Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Verification Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Verification Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="errorExample"
                mini-icon="E"
                text="Error"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Error Error404' }"
                    mini-icon="E"
                    text="Error 404"
                  />
                  <sidenav-item
                    :to="{ name: 'Error Error500' }"
                    mini-icon="E"
                    text="Error 500"
                  />
                </template>
              </sidenav-collapse-item> -->
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <!-- <li class="mt-3 nav-item">
        <hr class="mt-0 horizontal dark" />
        <h6
          class="text-xs ps-4 ms-2 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          DOCS
        </h6>
      </li> -->
      <!-- <li class="nav-item">
        <sidenav-collapse
          collapse-ref="basicExamples"
          nav-text="Basic"
          :class="getRoute() === 'basic' ? 'active' : ''"
        >
          <template #icon>
            <i
              class="ni ni-spaceship text-sm"
              :class="
                $store.state.sidebarType === 'bg-default' ||
                $store.state.darkMode
                  ? 'text-white'
                  : 'text-dark'
              "
            ></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <sidenav-collapse-item
                refer="gettingStartedExample"
                mini-icon="G"
                text="Getting Started"
              >
                <template #nav-child-item>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/quick-start/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">Q</span>
                      <span class="sidenav-normal">Quick Start</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/license/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">L</span>
                      <span class="sidenav-normal">License</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">C</span>
                      <span class="sidenav-normal">Contents</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/build-tools/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">B</span>
                      <span class="sidenav-normal">Build Tools</span>
                    </a>
                  </li>
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="foundationExample"
                mini-icon="F"
                text="Foundation"
              >
                <template #nav-child-item>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/colors/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">C</span>
                      <span class="sidenav-normal">Colors</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/grid/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">G</span>
                      <span class="sidenav-normal">Grid</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/typography/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">T</span>
                      <span class="sidenav-normal">Typography</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/icons/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">I</span>
                      <span class="sidenav-normal">Icons</span>
                    </a>
                  </li>
                </template>
              </sidenav-collapse-item>
            </ul>
          </template>
        </sidenav-collapse>
      </li> -->
      <!-- <li class="nav-item">
        <sidenav-collapse
          collapse-ref="componentsExamples"
          nav-text="Components"
          :class="getRoute() === 'components' ? 'active' : ''"
        >
          <template #icon>
            <i
              class="ni ni-app text-sm"
              :class="
                $store.state.sidebarType === 'bg-default' ||
                $store.state.darkMode
                  ? 'text-white'
                  : 'text-dark'
              "
            ></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/alerts/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">A</span>
                  <span class="sidenav-normal">Alerts</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/badge/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">B</span>
                  <span class="sidenav-normal">Badge</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/buttons/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">B</span>
                  <span class="sidenav-normal">Buttons</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/cards/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Card</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/carousel/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Carousel</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/collapse/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Collapse</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/dropdowns/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">D</span>
                  <span class="sidenav-normal">Dropdowns</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/forms/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">F</span>
                  <span class="sidenav-normal">Forms</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/modal/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">M</span>
                  <span class="sidenav-normal">Modal</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/navs/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">N</span>
                  <span class="sidenav-normal">Navs</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/navbar/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">N</span>
                  <span class="sidenav-normal">Navbar</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/pagination/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Pagination</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/popovers/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Popovers</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/progress/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Progress</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/spinners/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">S</span>
                  <span class="sidenav-normal">Spinners</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/tables/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">T</span>
                  <span class="sidenav-normal">Tables</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/tooltips/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">T</span>
                  <span class="sidenav-normal">Tooltips</span>
                </a>
              </li>
            </ul>
          </template>
        </sidenav-collapse>
      </li> -->
      <!-- <li class="nav-item">
        <sidenav-collapse
          nav-text="Changelog"
          :collapse="false"
          url="#"
          :aria-controls="''"
          collapse-ref=""
        >
          <template #icon>
            <i
              class="ni ni-align-left-2 text-sm"
              :class="
                $store.state.sidebarType === 'bg-default' ||
                $store.state.darkMode
                  ? 'text-white'
                  : 'text-dark'
              "
            ></i>
          </template>
        </sidenav-collapse>
      </li> -->
    </ul>
  </div>
  <div class="mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'RegStudio使用说明',
            // route:
            //   'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark'
          }
        ]
      }"
    />
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";
import { getCategoryIPApi,getProjectIPApi } from "@/http/api/ip"
import { mapState } from 'vuex';

// import SidenavCollapseItem from "./SidenavCollapseItem.vue";

export default {
  name: "SidenavList",
  components: {
    SidenavItem,
    SidenavCollapse,
    SidenavCard,
    // SidenavCollapseItem
  },
  data(){
    return{
      filterAllCategoryListVuex:[]
      // categoryList:JSON.parse(localStorage.getItem("allCategoryListVuex"))
    }
  },


  //关联vuex获取数据
  computed:{
    ...mapState('IP',['allCategoryListVuex']),
    ...mapState('IP',['allProjectListVuex']),
  },
  created(){
    if(this.allCategoryListVuex.length!=0){
      for (var i in this.allCategoryListVuex){
        // console.log(this.allCategoryListVuex[i].versionList)
        this.allCategoryListVuex[i].versionList = this.allCategoryListVuex[i].versionList.filter(item => item.seePermission.includes(localStorage.getItem('user')));
      }
    }
    // if(this.allProjectListVuex.length!=0){
    //   for (var j in this.allProjectListVuex){
    //     this.allProjectListVuex[j].versionList = this.allProjectListVuex[j].versionList.filter(item => item.seePermission.includes(localStorage.getItem('user')));
    //   }
    // }
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    // handleOpen(key, keyPath){
    //   console.log(key, keyPath)
    // },
    // handleClose(key, keyPath){
    //   console.log(key, keyPath)
    // },
    jumpIPList(category,name){
      getCategoryIPApi(category,name).then((res)=>{
        this.$store.commit('IP/getCategoryIpList',res)
      })
      this.$router.push({
        path: "/ecommerce/Orders/order-list",
        name: "Order List",
        params:{source:"category"}
      })
    },
    jumpProjectIPList(project,version){
      getProjectIPApi(project).then((res)=>{
        this.$store.commit('IP/getProjectIpList',res)
      })
      this.$router.push({
        path: "/ecommerce/Orders/order-list",
        name: "Order List",
        params:{source:"project",version:version}
      })
    }
    
  }
};
</script>

<style>
.custom-menu {
  border: none;
}
.custom-arrow {
  display: inline-block;
  transform: rotate(90deg);
}
</style>
