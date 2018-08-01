import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// PAGE Components
import { HomePageComponent } from './pages/HomePage/HomePageComponent';
import { PageNotFoundComponent } from './pages/PageNotFound/PageNotFoundComponent';
import { DevicesComponent } from './pages/Devices/DevicesComponent';
import { DeviceRegistrationComponent } from './pages/Devices/DeviceRegistrationComponent';

// Account
import { AccountSettingsComponent } from './pages/Account/AccountSettingsComponent';
import { RegisterComponent } from './pages/Account/RegisterComponent';
import { LoginComponent } from './pages/Account/LoginComponent';
import { LogoutComponent } from './pages/Account/LogoutComponent';
import { RecoveryComponent } from './pages/Account/RecoveryComponent';
import { DashboardSettingsComponent } from './pages/Account/DashboardSettingsComponent';
import { MyDevicesComponent } from './pages/Account/MyDevicesComponent';

// Analytics tools
import { TemperatureHistoryComponent } from './pages/AnalyticsTools/TemperatureHistoryComponent';
import { AlarmHistoryComponent } from './pages/AnalyticsTools/AlarmHistoryComponent';

// MCB UI components
import { MCBBoostComponent } from './mcbpages/MCBBoostComponent';
import { MCBHomeComponent} from './mcbpages/MCBHomeComponent';
import { MCBFansComponent} from './mcbpages/MCBFansComponent';
import { MCBMainMenuComponent} from './mcbpages/MCBMainMenuComponent';
import { MCBAlarmsPageComponent} from './mcbpages/MCBAlarmsPageComponent';
import { MCBEconomyComponent} from './mcbpages/MCBEconomyComponent';
import { MCBBuildingProtectionComponent} from './mcbpages/MCBBuildingProtectionComponent';
import { MCBFiltersResetComponent} from './mcbpages/MCBFiltersResetComponent';
import { MCBOtherComponent } from './mcbpages/MCBOtherComponent';
import { MCBHeatingSeasonComponent } from './mcbpages/MCBHeatingSeasonComponent';
import { MCBNightCoolingComponent } from './mcbpages/MCBNightCoolingComponent';
import { MCBHumidityComponent } from './mcbpages/MCBHumidityComponent';
import { MCBCO2Component } from './mcbpages/MCBCO2Component';
import { MCBDateTimeComponent } from './mcbpages/MCBDateTimeComponent';
import { MCBStatusPageComponent } from './mcbpages/MCBStatusPageComponent';
import { MCBSchedulerPageComponent } from './mcbpages/MCBSchedulerPageComponent';

// Guards
//import {AdminGuard} from './guards/AdminGuard';
import {GuestGuard} from './guards/GuestGuard';
import {NoAccountGuard} from './guards/NoAccountGuard';


// Breadcrumb back paths!
const mcb_menu_path = {
    state: 'mcb',
    path: [
        { href: 'devices', label: 'VENTILATION_CONTROL' },
        { href: 'mcbhome', label: 'HOME' },
        { href: 'mcbmenu', label: 'MENU' },
    ]
}; 

const mcb_home_path = {
    state: 'mcb',
    path: [
        { href: 'devices', label: 'VENTILATION_CONTROL' },
        { href: 'mcbhome', label: 'HOME' },
    ]
};

const back_to_vent_ctrl = {
    state: 'mcb',
    path: [
        { href: 'devices', label: 'VENTILATION_CONTROL' }
    ]
};

// Routes
const routes: Routes = [
  // Main routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Account
  { path: 'login', component: LoginComponent, canActivate: [NoAccountGuard] },
  { path: 'register', component: RegisterComponent },  
  { path: 'recovery', component: RecoveryComponent },  
  { path: 'logout', component: LogoutComponent, canActivate: [GuestGuard] },
  { path: 'account_settings', component: AccountSettingsComponent, canActivate: [GuestGuard] },
  { path: 'dashboard_settings', component: DashboardSettingsComponent, canActivate: [GuestGuard] },
  { path: 'device_settings', component: MyDevicesComponent, canActivate: [GuestGuard] },
  
  //Site
  { path: 'home', component: HomePageComponent, canActivate: [GuestGuard], data: { state: 'home' } },
  { path: 'devices', component: DevicesComponent, canActivate: [GuestGuard], data: { state: 'devices' } },
  { path: 'device_registration', component: DeviceRegistrationComponent, canActivate: [GuestGuard] },
  
  // Analytic tools routes
  { path: 'temperature_history', component: TemperatureHistoryComponent, canActivate: [GuestGuard] },
  { path: 'alarm_history', component: AlarmHistoryComponent, canActivate: [GuestGuard] },
  
  // MCB Routes
  { path: 'mcbhome', component: MCBHomeComponent, canActivate: [GuestGuard], data: back_to_vent_ctrl},
  { path: 'mcbfans', component: MCBFansComponent, canActivate: [GuestGuard], data: mcb_home_path},
  { path: 'mcbmenu', component: MCBMainMenuComponent, canActivate: [GuestGuard], data: mcb_home_path}, 
  { path: 'mcbalarms', component: MCBAlarmsPageComponent, canActivate: [GuestGuard], data: mcb_home_path}, 
  { path: 'boost', component: MCBBoostComponent, canActivate: [GuestGuard], data: mcb_menu_path}, 
  { path: 'economy', component: MCBEconomyComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'building_protection', component: MCBBuildingProtectionComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'filter_reset', component: MCBFiltersResetComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'other', component: MCBOtherComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'heating_season', component: MCBHeatingSeasonComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'night_cooling', component: MCBNightCoolingComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'humidity', component: MCBHumidityComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'co2_level', component: MCBCO2Component, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'time', component: MCBDateTimeComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  
  { path: 'status', component: MCBStatusPageComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  { path: 'scheduler', component: MCBSchedulerPageComponent, canActivate: [GuestGuard], data: mcb_menu_path }, 
  
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true })],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
