import * as gcp from '@pulumi/gcp';

export const zone = new gcp.dns.ManagedZone(
  'bjerk-fi-zone',
  {
    name: 'bjerk-fi',
    description: 'Bjerk Finnish domain',
    dnsName: 'bjerk.fi.',
    forceDestroy: false,
    visibility: 'public',
  },
  { protect: true },
);

const managedZone = zone.name;
const ttl = 300;

const opts = { protect: true };

// Website Related
new gcp.dns.RecordSet(
  'bjerk-fi-a',
  {
    managedZone,
    name: 'bjerk.fi.',
    rrdatas: ['151.101.1.195', '151.101.65.195'],
    ttl,
    type: 'A',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-fi-www',
  {
    managedZone,
    name: 'www.bjerk.fi.',
    rrdatas: ['151.101.1.195', '151.101.65.195'],
    ttl,
    type: 'A',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-fi-domainkey',
  {
    managedZone,
    name: 'google._domainkey.bjerk.fi.',
    rrdatas: [
      '"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCm4aIBCxoLf7/aXo1uPXVsSmSOXwJ+JvUTrzMgSVVtpc20Jwl/SWfQhTWSa1Mjcu2dMihggVUesgfGOYYnPf9wb7YFAlPKJ2W4XVdtbv+Pr4gJG8+s/k3UBFyrW/auFoO2o+eKQfTjXTEFLQ+S5SzUnuGmnTzamvwx1yhfNzH3VQIDAQAB"',
    ],
    ttl,
    type: 'TXT',
  },
  opts,
);

// Other
new gcp.dns.RecordSet(
  'bjerk-fi-txt',
  {
    managedZone,
    name: 'bjerk.fi.',
    rrdatas: [
      '"google-site-verification=omFgAlSfNAFm9yBlSecloCXp4VPeCyY25zAkVhHu2eY"',
      '"workplace-domain-verification=6RlSLDy0KFHzwQMW23J2eF7L7LwITS"',
      '"v=spf1 include:_spf.tripletex.no include:_spf.google.com ~all"',
      '"apple-domain-verification=cL42RyEQootY7t5z"',
    ],
    ttl,
    type: 'TXT',
  },
  opts,
);
