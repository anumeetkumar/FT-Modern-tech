import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Material Design Icons (MUI)
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import FireplaceRoundedIcon from "@mui/icons-material/FireplaceRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import FirebaseConfig from './settings/apiConfig/FirebaseConfig';
import ReverseCoding from './settings/apiConfig/ReverseCoding';
import SSOConfig from './settings/apiConfig/SSOConfig';


// Types
export type FirebaseConfig = {
  enabled: boolean;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export type ReverseGeocodingConfig = {
  enabled: boolean;
  provider: 'google' | 'here' | 'tomtom' | 'mapbox' | 'locationiq' | 'osm';
  providerActive: boolean;
  
  // Google Maps - Required fields only
  googleApiKey?: string;
  
  // HERE Maps - Required fields only
  hereApiKey?: string;
  
  // TomTom - Required fields only
  tomtomApiKey?: string;
  
  // Mapbox - Required fields only
  mapboxAccessToken?: string;
  
  // LocationIQ - Required fields only
  locationiqApiKey?: string;
  
  // OSM - Required fields only
  osmUserAgent?: string; // Required by OSM policy
};

export type SSOConfig = {
  enabled: boolean;
  googleClientId: string;
  googleClientSecret: string;
  redirectUri: string;
};

export type WhatsAppConfig = {
  enabled: boolean;
  provider: 'twilio' | 'whatsapp-business-api';
  providerActive: boolean; // Activate selected provider
  accountSid?: string; // Twilio
  authToken?: string; // Twilio
  phoneNumberId?: string; // WhatsApp Business API
  accessToken?: string; // WhatsApp Business API
};

export type OpenAIConfig = {
  enabled: boolean;
  apiKey: string;
  organizationId?: string;
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  maxTokens: number;
};

export type APIConfigs = {
  firebase: FirebaseConfig;
  reverseGeocoding: ReverseGeocodingConfig;
  sso: SSOConfig;
  whatsapp: WhatsAppConfig;
  openai: OpenAIConfig;
  updatedAt: string;
};


// Mock initial data
const initialConfigs: APIConfigs = {
  firebase: {
    enabled: true,
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "fleetstack-project.firebaseapp.com",
    projectId: "fleetstack-project",
    storageBucket: "fleetstack-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890",
    measurementId: "G-XXXXXXXXXX",
  },
  reverseGeocoding: {
    enabled: true,
    provider: 'google',
    providerActive: true,
    googleApiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    hereApiKey: "",
    tomtomApiKey: "",
    mapboxAccessToken: "",
    locationiqApiKey: "",
    osmUserAgent: "FleetStack/1.0",
  },
  sso: {
    enabled: true,
    googleClientId: "123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
    googleClientSecret: "GOCSPX-xxxxxxxxxxxxxxxxxxxx",
    redirectUri: "https://app.fleetstack.com/auth/google/callback",
  },
  whatsapp: {
    enabled: true,
    provider: 'twilio',
    providerActive: true,
    accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authToken: "your_auth_token_here",
    phoneNumberId: "",
    accessToken: "",
  },
  openai: {
    enabled: true,
    apiKey: "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    organizationId: "org-xxxxxxxxxxxxxxxx",
    model: 'gpt-4-turbo',
    maxTokens: 2048,
  },
  updatedAt: "2025-10-18T09:15:00Z",
};


function SuperAdminAPIConfig() {
  const [loading, setLoading] = React.useState(false);
  const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
  
  // Visibility states for sensitive fields
  const [showFirebaseKey, setShowFirebaseKey] = React.useState(false);
  const [showGeocodingKey, setShowGeocodingKey] = React.useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = React.useState(false);
  const [showWhatsAppToken, setShowWhatsAppToken] = React.useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = React.useState(false);

  // Update handlers
  const updateFirebase = (field: keyof FirebaseConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      firebase: { ...prev.firebase, [field]: value }
    }));
  };

  const updateReverseGeocoding = (field: keyof ReverseGeocodingConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      reverseGeocoding: { ...prev.reverseGeocoding, [field]: value }
    }));
  };

  const updateSSO = (field: keyof SSOConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      sso: { ...prev.sso, [field]: value }
    }));
  };

  const updateWhatsApp = (field: keyof WhatsAppConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, [field]: value }
    }));
  };

  const updateOpenAI = (field: keyof OpenAIConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      openai: { ...prev.openai, [field]: value }
    }));
  };

  // Test connection handlers
  const testConnection = (service: string) => {
    console.log(`Testing ${service} connection...`);
    alert(`Testing ${service} connection. Check console for results.`);
  };

  // Save handler
  const handleSave = async () => {
    setLoading(true);
    console.log("Saving API configurations...", configs);
    
    // TODO: Implement API call to save configurations
    setTimeout(() => {
      setConfigs(prev => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));
      setLoading(false);
      alert("API configurations saved successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 dark:text-neutral-100">Saving...</h2>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
     <CardHeader className="pb-2">
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
        API Configuration
      </div>
      <CardTitle className="text-2xl tracking-tight text-foreground">
        Third-Party Integrations
      </CardTitle>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button
        className="rounded-xl bg-primary text-white "
        onClick={handleSave}
        disabled={loading}
      >
        <SaveRoundedIcon className="mr-2" fontSize="small" /> Save All Changes
      </Button>
    </div>
  </div>
</CardHeader>


      <CardContent className="pt-2 space-y-6">
        
        {/* Firebase Configuration */}
      <FirebaseConfig/>

        <Separator className="dark:bg-muted" />

        {/* Reverse Geocoding Configuration */}
       <ReverseCoding/>

        <Separator className="dark:bg-muted" />

        {/* SSO (Google) Configuration */}
        {/* <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LoginRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
              <div className="text-sm font-medium tracking-tight dark:text-neutral-100">SSO - Google OAuth 2.0</div>
              {configs.sso.enabled && (
                <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">Active</Badge>
              )}
            </div>
            <Switch
              checked={configs.sso.enabled}
              onCheckedChange={(checked) => updateSSO('enabled', checked)}
            />
          </div>

          {configs.sso.enabled && (
            <>
              <Alert className="mb-4 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                <InfoRoundedIcon className="h-4 w-4 dark:text-neutral-100" />
                <AlertDescription className="text-xs space-y-2 dark:text-neutral-300">
                  <div><strong>Setup Instructions:</strong></div>
                  <ol className="list-decimal list-inside ml-2 space-y-1">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline dark:text-neutral-100">Google Cloud Console</a></li>
                    <li>Create OAuth 2.0 Client ID (Application type: Web application)</li>
                    <li>Add authorized redirect URI: <code className="bg-white dark:bg-neutral-800 dark:text-neutral-100 px-1 py-0.5 rounded text-[10px]">{configs.sso.redirectUri}</code></li>
                    <li>Copy Client ID and Client Secret</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sso-clientId" className="text-sm dark:text-neutral-200">Google Client ID</Label>
                  <Input 
                    id="sso-clientId"
                    type="text"
                    value={configs.sso.googleClientId}
                    onChange={(e) => updateSSO('googleClientId', e.target.value)}
                    className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                    placeholder="123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                  />
                </div>

                <div>
                  <Label htmlFor="sso-clientSecret" className="text-sm dark:text-neutral-200">Google Client Secret</Label>
                  <div className="relative mt-1.5">
                    <Input 
                      id="sso-clientSecret"
                      type={showGoogleSecret ? "text" : "password"}
                      value={configs.sso.googleClientSecret}
                      onChange={(e) => updateSSO('googleClientSecret', e.target.value)}
                      className="rounded-lg pr-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                      placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                    >
                      {showGoogleSecret ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sso-redirectUri" className="text-sm dark:text-neutral-200">Redirect URI</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      id="sso-redirectUri"
                      type="text"
                      value={configs.sso.redirectUri}
                      onChange={(e) => updateSSO('redirectUri', e.target.value)}
                      className="rounded-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                      placeholder="https://yourdomain.com/auth/google/callback"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-lg dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      onClick={() => navigator.clipboard.writeText(configs.sso.redirectUri)}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Add this URL to authorized redirect URIs in Google Console</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="rounded-lg mt-4 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                onClick={() => testConnection('Google SSO')}
              >
                <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
                Test SSO Connection
              </Button>
            </>
          )}
        </div> */}
        <SSOConfig/>

        <Separator className="dark:bg-neutral-700" />

        {/* WhatsApp Configuration */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
              <div className="text-sm font-medium tracking-tight dark:text-neutral-100">WhatsApp Messaging</div>
              {configs.whatsapp.enabled && (
                <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">Active</Badge>
              )}
            </div>
            <Switch
              checked={configs.whatsapp.enabled}
              onCheckedChange={(checked) => updateWhatsApp('enabled', checked)}
            />
          </div>

          {configs.whatsapp.enabled && (
            <>
              <Alert className="mb-4 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                <InfoRoundedIcon className="h-4 w-4 dark:text-neutral-100" />
                <AlertDescription className="text-xs dark:text-neutral-300">
                  <div className="font-semibold mb-1">Configure Your WhatsApp Provider</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Select a provider, enter credentials, and activate it to start sending WhatsApp messages.</div>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {/* Provider Selection Dropdown */}
                <div>
                  <Label htmlFor="whatsapp-provider" className="text-sm font-medium dark:text-neutral-200">Select Provider</Label>
                  <Select 
                    value={configs.whatsapp.provider}
                    onValueChange={(value: any) => updateWhatsApp('provider', value)}
                  >
                    <SelectTrigger className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700">
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="whatsapp-business-api">WhatsApp Business API (Meta)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                    Selected: <strong className="text-neutral-700 dark:text-neutral-300">{
                      configs.whatsapp.provider === 'twilio' ? 'Twilio' : 'WhatsApp Business API (Meta)'
                    }</strong>
                  </p>
                </div>

                {/* Activate Provider Toggle */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium dark:text-neutral-100">Activate Provider</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {configs.whatsapp.providerActive 
                          ? `${configs.whatsapp.provider === 'twilio' ? 'Twilio' : 'WhatsApp Business API'} is currently active and in use`
                          : 'Activate this provider to start sending WhatsApp messages'}
                      </div>
                    </div>
                    <Switch
                      checked={configs.whatsapp.providerActive}
                      onCheckedChange={(checked) => updateWhatsApp('providerActive', checked)}
                    />
                  </div>
                  {configs.whatsapp.providerActive && (
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <Badge className="bg-black dark:bg-white text-white dark:text-black">ACTIVE</Badge>
                      <span className="text-neutral-600 dark:text-neutral-300">This provider is now handling all WhatsApp messaging</span>
                    </div>
                  )}
                </div>

                {/* Provider Setup Links */}
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="text-xs font-medium mb-2 dark:text-neutral-100">Provider Documentation & Setup</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white underline-offset-2 hover:underline">→ Twilio Console</a>
                    <a href="https://business.facebook.com/wa/manage/home" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white underline-offset-2 hover:underline">→ Meta Business Manager</a>
                  </div>
                </div>
              </div>

              <Separator className="my-4 dark:bg-neutral-700" />

              <div className="space-y-4">
                {/* Twilio Fields */}
                {configs.whatsapp.provider === 'twilio' && (
                  <>
                    <div>
                      <Label htmlFor="whatsapp-accountSid" className="text-sm dark:text-neutral-200">Account SID</Label>
                      <Input 
                        id="whatsapp-accountSid"
                        type="text"
                        value={configs.whatsapp.accountSid || ''}
                        onChange={(e) => updateWhatsApp('accountSid', e.target.value)}
                        className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp-authToken" className="text-sm dark:text-neutral-200">Auth Token</Label>
                      <div className="relative mt-1.5">
                        <Input 
                          id="whatsapp-authToken"
                          type={showWhatsAppToken ? "text" : "password"}
                          value={configs.whatsapp.authToken || ''}
                          onChange={(e) => updateWhatsApp('authToken', e.target.value)}
                          className="rounded-lg pr-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                        >
                          {showWhatsAppToken ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* WhatsApp Business API Fields */}
                {configs.whatsapp.provider === 'whatsapp-business-api' && (
                  <>
                    <div>
                      <Label htmlFor="whatsapp-phoneNumberId" className="text-sm dark:text-neutral-200">Phone Number ID</Label>
                      <Input 
                        id="whatsapp-phoneNumberId"
                        type="text"
                        value={configs.whatsapp.phoneNumberId || ''}
                        onChange={(e) => updateWhatsApp('phoneNumberId', e.target.value)}
                        className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                        placeholder="123456789012345"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp-accessToken" className="text-sm dark:text-neutral-200">Access Token</Label>
                      <div className="relative mt-1.5">
                        <Input 
                          id="whatsapp-accessToken"
                          type={showWhatsAppToken ? "text" : "password"}
                          value={configs.whatsapp.accessToken || ''}
                          onChange={(e) => updateWhatsApp('accessToken', e.target.value)}
                          className="rounded-lg pr-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                        >
                          {showWhatsAppToken ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button 
                variant="outline" 
                className="rounded-lg mt-4 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                onClick={() => testConnection('WhatsApp')}
              >
                <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
                Test WhatsApp Connection
              </Button>
            </>
          )}
        </div>

        <Separator className="dark:bg-neutral-700" />

        {/* OpenAI Configuration */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SmartToyRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
              <div className="text-sm font-medium tracking-tight dark:text-neutral-100">OpenAI Integration</div>
              {configs.openai.enabled && (
                <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">Active</Badge>
              )}
            </div>
            <Switch
              checked={configs.openai.enabled}
              onCheckedChange={(checked) => updateOpenAI('enabled', checked)}
            />
          </div>

          {configs.openai.enabled && (
            <>
              <Alert className="mb-4 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                <InfoRoundedIcon className="h-4 w-4 dark:text-neutral-100" />
                <AlertDescription className="text-xs space-y-2 dark:text-neutral-300">
                  <div><strong>Setup Instructions:</strong></div>
                  <ol className="list-decimal list-inside ml-2 space-y-1">
                    <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline dark:text-neutral-100">OpenAI API Keys</a></li>
                    <li>Create new secret key (starts with sk-proj-...)</li>
                    <li>Optional: Get Organization ID from <a href="https://platform.openai.com/account/organization" target="_blank" rel="noopener noreferrer" className="underline dark:text-neutral-100">Settings</a></li>
                    <li>Set usage limits in <a href="https://platform.openai.com/account/billing/limits" target="_blank" rel="noopener noreferrer" className="underline dark:text-neutral-100">Billing</a></li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="openai-apiKey" className="text-sm dark:text-neutral-200">API Key</Label>
                  <div className="relative mt-1.5">
                    <Input 
                      id="openai-apiKey"
                      type={showOpenAIKey ? "text" : "password"}
                      value={configs.openai.apiKey}
                      onChange={(e) => updateOpenAI('apiKey', e.target.value)}
                      className="rounded-lg pr-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                      placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                    >
                      {showOpenAIKey ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="openai-organizationId" className="text-sm dark:text-neutral-200">Organization ID (Optional)</Label>
                  <Input 
                    id="openai-organizationId"
                    type="text"
                    value={configs.openai.organizationId || ''}
                    onChange={(e) => updateOpenAI('organizationId', e.target.value)}
                    className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                    placeholder="org-xxxxxxxxxxxxxxxx"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openai-model" className="text-sm dark:text-neutral-200">Model</Label>
                    <Select 
                      value={configs.openai.model}
                      onValueChange={(value: any) => updateOpenAI('model', value)}
                    >
                      <SelectTrigger className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700">
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Recommended)</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Cost-effective)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="openai-maxTokens" className="text-sm dark:text-neutral-200">Max Tokens</Label>
                    <Input 
                      id="openai-maxTokens"
                      type="number"
                      value={configs.openai.maxTokens}
                      onChange={(e) => updateOpenAI('maxTokens', parseInt(e.target.value))}
                      className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                      min="1"
                      max="4096"
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Range: 1-4096 tokens</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="rounded-lg mt-4 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                onClick={() => testConnection('OpenAI')}
              >
                <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
                Test OpenAI Connection
              </Button>
            </>
          )}
        </div>

        {/* Documentation Links */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5 bg-neutral-50 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-3">
            <LinkRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
            <div className="text-sm font-medium tracking-tight dark:text-neutral-100">Useful Documentation</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <a href="https://firebase.google.com/docs/web/setup" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600">
              <div className="font-medium dark:text-neutral-100">Firebase Setup</div>
              <div className="text-neutral-500 dark:text-neutral-400">Web SDK Documentation</div>
            </a>
            <a href="https://developers.google.com/maps/documentation/geocoding" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600">
              <div className="font-medium dark:text-neutral-100">Google Geocoding</div>
              <div className="text-neutral-500 dark:text-neutral-400">API Documentation</div>
            </a>
            <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600">
              <div className="font-medium dark:text-neutral-100">Google OAuth 2.0</div>
              <div className="text-neutral-500 dark:text-neutral-400">SSO Implementation</div>
            </a>
            <a href="https://www.twilio.com/docs/whatsapp" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600">
              <div className="font-medium dark:text-neutral-100">Twilio WhatsApp</div>
              <div className="text-neutral-500 dark:text-neutral-400">API Documentation</div>
            </a>
            <a href="https://developers.facebook.com/docs/whatsapp" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600">
              <div className="font-medium dark:text-neutral-100">WhatsApp Business</div>
              <div className="text-neutral-500 dark:text-neutral-400">Meta Documentation</div>
            </a>
            <a href="https://platform.openai.com/docs/introduction" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600">
              <div className="font-medium dark:text-neutral-100">OpenAI API</div>
              <div className="text-neutral-500 dark:text-neutral-400">Platform Documentation</div>
            </a>
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg dark:border dark:border-neutral-700">
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(configs.updatedAt).toLocaleString()}
          </div>
          <Badge variant="outline" className="text-xs dark:border-neutral-600 dark:text-neutral-300">
            <CheckCircleRoundedIcon fontSize="small" className="mr-1" />
            Configurations stored securely
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default SuperAdminAPIConfig;
