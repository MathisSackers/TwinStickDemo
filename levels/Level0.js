// Level in format inspired by bulletML

const level0 = `
<document>
<action type='slow'>
  <wait type='time'>60</wait>
  <!-- Part 1 -->
  <!-- 3 + (2 per player) enemies. Each spawns 3-5(same for all enemies) more 2 seconds after death. -->
    <action type='slow'>
      <var type='set' name='children'>3 + _($rand * 2)</var>
      <repeat type='fast'>
        <times>3 + _($playerNum * 2)</times>
        <action type='slow'>
          <spawn>
            <enemy/>
          </spawn>
          <wait type='time'>120</wait>
          <repeat type='fast'>
            <times>$children</times>
            <action type='slow'>
              <spawn>
                <enemy/>
              </spawn>
            </action>
          </repeat>
        </action>
      </repeat>
    </action>
  <wait type='time'>60</wait>
  <!-- Part 2 -->
  <!-- Spawn 1 enemy/second; they die after 10 are killed -->
  <action type='slow'>
    <var type='set' name='killed'>0</var>
    <ctl>$killed &lt; 10</ctl>
    <repeat type='slow'>
      <times>9999</times>
      <action type='fast'>
        <action type='slow'>
          <spawn>
            <enemy/>
          </spawn>
          <var type='add' name='killed'>1</var>
        </action>
        <wait type='time'>60</wait>
      </action>
    </repeat>
  </action>
  <wait type='time'>120</wait>
  <!-- Part 3 -->
  <!-- Spawn 6 enemies/second; they die after 8s~25s with ~16s being the most probable -->
  <action type='slow'>
    <ttl>(500) + _($clt * 1000)</ttl>
    <repeat type='slow'>
      <times>9999</times>
      <action type='fast'>
        <spawn>
          <enemy/>
        </spawn>
        <wait type='time'>10</wait>
      </action>
    </repeat>
  </action>
  <wait type='time'>480</wait>
</action>
</document>`;
