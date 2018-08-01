// Angular poop
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Widgets
import { RangeWidgetComponent } from './widgets/range_widget/RangeWidgetComponent';
import { OnOffWidgetComponent} from './widgets/onoff_widget/OnOffWidgetComponent';
import { XVWidget } from './widgets/x_v_widget//XVWidget';
import { SharedRegisterWidgetComponent } from './widgets/shared_register_widget/SharedRegisterWidgetComponent';
import { MenuWidgetComponent } from './widgets/menu_widget/MenuWidgetComponent';
import { MCBHomeMenuWidgetComponent } from './widgets/mcb_home_menu_widget/MCBHomeMenuWidgetComponent';
import { MCBHomeMenuBlock } from './widgets/mcb_home_menu_widget/MCBHomeMenuBlock';
import { BoostWidgetComponent } from './widgets/boost_widget/BoostWidgetComponent';
import { MCBHeaderWidget } from './widgets/mcb_header_widget/MCBHeaderWidget';
import { MCBMainMenuWidgetComponent } from './widgets/mcb_main_menu_widget/MCBMainMenuWidgetComponent';
import { AlarmWidgetComponent } from './widgets/alarm_widget/AlarmWidgetComponent';
import { MeterWidgetComponent } from './widgets/meter_widget/MeterWidgetComponent';
import { LineChartComponent } from './widgets/line_chart_widget/LineChartComponent';
import { AirHandlingUnitWidgetComponent } from './widgets/ahu_widget/AirHandlingUnitWidgetComponent';
import { MCBStatusWidgetComponent } from './widgets/mcb_status_widget/MCBStatusWidgetComponent';
import { SchedulerWidgetComponent } from './widgets/scheduler_widget/SchedulerWidgetComponent';
import { BarChartComponent } from './widgets/bar_chart_widget//BarChartComponent';


// Pages
import { HomePageComponent } from './pages/HomePage/HomePageComponent';
import { PageNotFoundComponent } from './pages/PageNotFound/PageNotFoundComponent';
import { DevicesComponent } from './pages/Devices/DevicesComponent';
import { DeviceRegistrationComponent } from './pages/Devices/DeviceRegistrationComponent';

// Account
import { LogoutComponent } from './pages/Account/LogoutComponent';
import { RegisterComponent } from './pages/Account/RegisterComponent';
import { AccountSettingsComponent } from './pages/Account/AccountSettingsComponent';
import { LoginComponent } from './pages/Account/LoginComponent';
import { RecoveryComponent } from './pages/Account/RecoveryComponent';
import { DashboardSettingsComponent } from './pages/Account/DashboardSettingsComponent';
import { MyDevicesComponent } from './pages/Account/MyDevicesComponent';

// Analytics tools
import { TemperatureHistoryComponent } from './pages/AnalyticsTools/TemperatureHistoryComponent';
import { AlarmHistoryComponent } from './pages/AnalyticsTools/AlarmHistoryComponent';

// MCB Pages
import { MCBHomeComponent } from './mcbpages/MCBHomeComponent';
import { MCBFansComponent } from './mcbpages/MCBFansComponent';
import { MCBMainMenuComponent } from './mcbpages/MCBMainMenuComponent';
import { MCBAlarmsPageComponent } from './mcbpages/MCBAlarmsPageComponent';
import { MCBBoostComponent } from './mcbpages/MCBBoostComponent';
import { MCBEconomyComponent} from './mcbpages/MCBEconomyComponent';
import { MCBBuildingProtectionComponent } from './mcbpages/MCBBuildingProtectionComponent';
import { MCBFiltersResetComponent } from './mcbpages/MCBFiltersResetComponent';
import { MCBOtherComponent } from './mcbpages/MCBOtherComponent';
import { MCBHeatingSeasonComponent } from './mcbpages/MCBHeatingSeasonComponent';
import { MCBNightCoolingComponent } from './mcbpages/MCBNightCoolingComponent';
import { MCBHumidityComponent } from './mcbpages/MCBHumidityComponent';
import { MCBCO2Component } from './mcbpages/MCBCO2Component';
import { MCBDateTimeComponent } from './mcbpages/MCBDateTimeComponent';
import { MCBStatusPageComponent } from './mcbpages/MCBStatusPageComponent';
import { MCBSchedulerPageComponent } from './mcbpages/MCBSchedulerPageComponent';

// Services
import { RegisterDataService } from './services/RegisterDataService';
import { UserService } from './services/UserService';
import { AuthService } from './services/AuthService';
import { DeviceService } from './services/DeviceService';
import { AlarmService } from './services/AlarmService';
import { TemperatureHistoryService } from './services/TemperatureHistoryService';
import { AlarmHistoryService } from './services/AlarmHistoryService';
import { CommandService } from './services/CommandService';

//Third party poop
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Directives
import { OnlyNumber } from './directives/OnlyNumber';

// Filters
import { Divide10Filter } from './filters/Divide10Filter';
import { Divide60Filter } from './filters/Divide60Filter';
import { PointFilter } from './filters/PointFilter';

// Guards
import { AdminGuard } from './guards/AdminGuard';
import { GuestGuard } from './guards/GuestGuard';
import { NoAccountGuard } from './guards/NoAccountGuard';

// Main
import { AppComponent } from './app.component';



export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    
    // Account
    LoginComponent,
    LogoutComponent,
    RecoveryComponent,
    AccountSettingsComponent,
    RegisterComponent,
    DashboardSettingsComponent,
    MyDevicesComponent,
    
    // Control
    MenuWidgetComponent,
    HomePageComponent,    
    PageNotFoundComponent,    
    
    // Device
    DevicesComponent,
    DeviceRegistrationComponent,
    
    // Analytics tools
    TemperatureHistoryComponent,
    AlarmHistoryComponent,

    // MCB
    MCBHomeMenuWidgetComponent,
    MCBHeaderWidget,
    MCBHomeComponent,   
    MCBFansComponent, 
    MCBMainMenuComponent,
    MCBMainMenuWidgetComponent,
    MCBAlarmsPageComponent,
    MCBBoostComponent,
    MCBEconomyComponent,
    MCBBuildingProtectionComponent,
    MCBFiltersResetComponent,
    MCBOtherComponent,
    MCBHeatingSeasonComponent,
    MCBNightCoolingComponent,
    MCBHumidityComponent,
    MCBCO2Component,
    MCBDateTimeComponent,
    MCBStatusPageComponent,
    MCBSchedulerPageComponent,
    
    // Widgets
    RangeWidgetComponent, 
    OnOffWidgetComponent, 
    XVWidget,
    MCBHomeMenuBlock, 
    SharedRegisterWidgetComponent,
    BoostWidgetComponent,
    AlarmWidgetComponent,
    MeterWidgetComponent,
    LineChartComponent,
    AirHandlingUnitWidgetComponent,
    MCBStatusWidgetComponent,
    SchedulerWidgetComponent,
    BarChartComponent,

    //Directives
    OnlyNumber,
    
    // Filters
    Divide10Filter, 
    Divide60Filter,
    PointFilter
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        }
    })
  ],
  providers: [
    RegisterDataService,
    UserService,
    AuthService,
    DeviceService,
    AlarmService,
    TemperatureHistoryService,
    AlarmHistoryService,
    CookieService,
    CommandService,
    AdminGuard,
    GuestGuard,
    NoAccountGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { 

}
