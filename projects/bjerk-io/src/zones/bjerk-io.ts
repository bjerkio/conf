import * as gcp from '@pulumi/gcp';

export const zone = new gcp.dns.ManagedZone(
  'bjerk-io-zone',
  {
    name: 'bjerk-io',
    description: 'Bjerk primary domain',
    dnsName: 'bjerk.io.',
    forceDestroy: false,
    visibility: 'public',
  },
  { protect: true },
);

const managedZone = zone.name;
const ttl = 300;

const opts = { protect: true };

// E-mail Related
new gcp.dns.RecordSet(
  'bjerk-io-mx',
  {
    managedZone,
    name: 'bjerk.io.',
    rrdatas: [
      '1 aspmx.l.google.com.',
      '5 alt1.aspmx.l.google.com.',
      '5 alt2.aspmx.l.google.com.',
      '10 alt3.aspmx.l.google.com.',
      '10 alt4.aspmx.l.google.com.',
    ],
    ttl,
    type: 'MX',
  },
  opts,
);

// Website Related
new gcp.dns.RecordSet(
  'bjerk-io-a',
  {
    managedZone,
    name: 'bjerk.io.',
    rrdatas: ['151.101.1.195', '151.101.65.195'],
    ttl,
    type: 'A',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-io-www',
  {
    managedZone,
    name: 'www.bjerk.io.',
    rrdatas: ['151.101.1.195', '151.101.65.195'],
    ttl,
    type: 'A',
  },
  opts,
);

// Email DKIM/SPAM Related
new gcp.dns.RecordSet(
  'bjerk-io-dmarc',
  {
    managedZone,
    name: '_dmarc.bjerk.io.',
    rrdatas: ['"v=DMARC1; p=none; rua=mailto:postmaster@bjerk.io"'],
    ttl: 300,
    type: 'TXT',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-io-domainkey',
  {
    managedZone,
    name: 'google._domainkey.bjerk.io.',
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
  'bjerk-io-txt',
  {
    managedZone,
    name: 'bjerk.io.',
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

new gcp.dns.RecordSet(
  'bjerk-io-github',
  {
    managedZone,
    name: '_github-challenge-bjerkio.bjerk.io.',
    rrdatas: ['"739c94e0e6"'],
    ttl,
    type: 'TXT',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-io-vault',
  {
    managedZone,
    name: 'vault.bjerk.io.',
    rrdatas: ['34.88.68.230'],
    ttl,
    type: 'A',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-io-studio',
  {
    managedZone,
    name: 'studio.bjerk.io.',
    rrdatas: ['bjerkio.github.io.'],
    ttl,
    type: 'CNAME',
  },
  opts,
);

new gcp.dns.RecordSet(
  'bjerk-io-gate',
  {
    managedZone,
    name: 'gate.bjerk.io.',
    rrdatas: ['bjerkio.github.io.'],
    ttl,
    type: 'CNAME',
  },
  opts,
);
