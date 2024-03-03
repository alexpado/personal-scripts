#!/usr/bin/env zx
(async () => {

  const store = '/root/.security/ufw';
  const entries = [];

  const ufw = await $`ufw status`;
  const ports = await $`cat "${store}/ports.conf"`;
  const netstat = await $`netstat -tunap | grep LISTEN`;

  const ufwOutput = ufw.stdout;
  const portsOutput = ports.stdout;
  const netstatOutput = netstat.stdout;

  const ufwEntryRegex = /^(?<port>[0-9]+)\/(?<type>tcp|udp).*?\s{2,}(?<action>ALLOW|DENY)\s{2,}(?<from>.*?)$/
  const portsRegex = /^(?<port>[0-9]+)\t+(?<type>tcp|udp)\t+(?<comment>.*)$/
  const netstatRegex = /^\w+\s+.*(.*\:(?<port>\d+)).*\d\/(?<app>.*?)\s+$/

  // Analyzing UFW output
  ufwOutput.split('\n')
    .filter(line => !line.includes('(v6)'))
    .forEach(line => {
      const match = ufwEntryRegex.exec(line);
      if (!match) return;
      const { groups: { port, type, action, from } } = match;
      if (action !== 'ALLOW') return;
      entries.push({
        port, type,
        action: action.trim(),
        from: from.trim(),
        comment: null,
        declared: { ufw: true, config: false },
        app: null
      });
    });

  // Analyzing configs
  portsOutput.split('\n')
    .filter(line => !line.startsWith('#') && line.length > 0)
    .forEach(line => {
      const match = portsRegex.exec(line);
      if (!match) return;
      const { groups: { port, type, comment } } = match;
      let defined = false;
      entries.forEach(entry => {
        if (entry.port === port) {
          entry.declared.config = true;
          entry.comment = comment;
          defined = true;
        }
      });

      if (!defined) {
        entries.push({ port, type, action: null, comment, declared: { ufw: false, config: true }, app: null });
      }
    });

  netstatOutput.split('\n')
    .map(line => netstatRegex.exec(line))
    .filter(match => match !== null)
    .map(match => { const { groups: { port, app } } = match; return { port, app: app.trim() } })
    .forEach(app => {
      entries.forEach(entry => {
        if (entry.port === app.port) {
          entry.app = app.app;
        }
      })
    });

  // Outputing
  entries.sort((a, b) => {
    return a.port - b.port;
  });

  entries.forEach(entry => {
    if (entry.declared.ufw && entry.declared.config) {
      entry.state = entry.app ? "listening" : "opened";
    } else if (!entry.declared.ufw && entry.declared.config) {
      entry.state = entry.app ? "blocked" : "closed";
    } else if (entry.declared.ufw && !entry.declared.config) {
      entry.state = entry.app ? "leaking" : "accessible"
    }

    entry.description = entry.comment || entry.app || "[unknown]";

    console.log(`${entry.state} ${entry.type} ${entry.port} ${entry.description}`);
  });


})();