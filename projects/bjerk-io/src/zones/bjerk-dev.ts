import * as gcp from '@pulumi/gcp';

export const zone = new gcp.dns.ManagedZone(
  'bjerk-dev-zone',
  {
    name: 'bjerk-dev',
    description: '',
    dnsName: 'bjerk.dev.',
    dnssecConfig: { state: 'on' },
    forceDestroy: false,
    visibility: 'public',
  },
  { protect: true },
);

const managedZone = zone.name;
const ttl = 300;
const opts = { protect: true };

new gcp.dns.RecordSet(
  'bjerk-dev-ml-newsletter',
  {
    managedZone,
    name: 'ml-newsletter.bjerk.dev.',
    rrdatas: ['bjerkio.github.io.'],
    ttl,
    type: 'CNAME',
  },
  opts,
);
