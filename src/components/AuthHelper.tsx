// components/AuthHelper.tsx

import { useState, useEffect } from 'react'

export interface AuthHeader {
  [key: string]: string
}

interface AuthHelperProps {
  onAuthChange: (header: AuthHeader) => void
}

const AuthHelper: React.FC<AuthHelperProps> = ({ onAuthChange }) => {
  const [authType, setAuthType] = useState<'none' | 'basic' | 'bearer' | 'oauth2'>('none')
  const [basicUser, setBasicUser] = useState('')
  const [basicPass, setBasicPass] = useState('')
  const [bearerToken, setBearerToken] = useState('')
  const [oauthTokenUrl, setOauthTokenUrl] = useState('')
  const [oauthClientId, setOauthClientId] = useState('')
  const [oauthClientSecret, setOauthClientSecret] = useState('')
  const [oauthAccessToken, setOauthAccessToken] = useState<string | null>(null)

  const fetchOauthToken = async () => {
    try {
      const resp = await fetch(oauthTokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: oauthClientId,
          client_secret: oauthClientSecret,
        }),
      })
      const data = await resp.json()
      setOauthAccessToken(data.access_token)
    } catch (err) {
      console.error('OAuth2 token error', err)
    }
  }

  useEffect(() => {
    const header: AuthHeader = {}
    if (authType === 'basic' && basicUser) {
      header.Authorization = `Basic ${btoa(`${basicUser}:${basicPass}`)}`
    } else if (authType === 'bearer' && bearerToken) {
      header.Authorization = `Bearer ${bearerToken}`
    } else if (authType === 'oauth2' && oauthAccessToken) {
      header.Authorization = `Bearer ${oauthAccessToken}`
    }
    onAuthChange(header)
  }, [authType, basicUser, basicPass, bearerToken, oauthAccessToken, onAuthChange])

  return (
    <div className="space-y-4">
      <select
        value={authType}
        onChange={e => setAuthType(e.target.value as any)}
        className="w-full px-4 py-2 border border-black rounded-md"
      >
        <option value="none">None</option>
        <option value="basic">Basic Auth</option>
        <option value="bearer">Bearer Token</option>
        <option value="oauth2">OAuth2 (Client Credentials)</option>
      </select>

      {authType === 'basic' && (
    <div className="mt-2 space-y-2">
      <input
        type="text"
        placeholder="Username"
        value={basicUser}
        onChange={e => setBasicUser(e.target.value)}
        className="w-full px-3 py-1 border border-black rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={basicPass}
        onChange={e => setBasicPass(e.target.value)}
        className="w-full px-3 py-1 border border-black rounded"
      />
    </div>
  )}

  {authType === 'bearer' && (
    <input
      type="text"
      placeholder="Bearer Token"
      value={bearerToken}
      onChange={e => setBearerToken(e.target.value)}
      className="w-full mt-2 px-3 py-1 border border-black rounded"
    />
  )}

  {authType === 'oauth2' && (
    <div className="mt-2 space-y-2">
      <input
        type="url"
        placeholder="Token URL"
        value={oauthTokenUrl}
        onChange={e => setOauthTokenUrl(e.target.value)}
        className="w-full px-3 py-1 border border-black rounded"
      />
      <input
        type="text"
        placeholder="Client ID"
        value={oauthClientId}
        onChange={e => setOauthClientId(e.target.value)}
        className="w-full px-3 py-1 border border-black rounded"
      />
      <input
        type="password"
        placeholder="Client Secret"
        value={oauthClientSecret}
        onChange={e => setOauthClientSecret(e.target.value)}
        className="w-full px-3 py-1 border border-black rounded"
      />
      <button
        type="button"
        onClick={fetchOauthToken}
        className="mt-1 text-[#ed1c24] hover:underline text-sm"
      >
        Get Token
      </button>
      {oauthAccessToken && (
        <p className="text-xs text-green-600 truncate">
          Token: {oauthAccessToken}
        </p>
      )}
    </div>
  )}
</div>
  )
}

export default AuthHelper
