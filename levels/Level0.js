// Level in format inspired by bulletML

const level0 = `
<document>
<action type='slow'>
  <wait type='time'>60</wait>
  <!-- Part 1 -->
  <!-- 3 + (2 per player) enemies -->
  <!-- Each spawns 3-5(same for all enemies) more 2 seconds after death. -->
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
  <!-- Spawn (1 * players) enemy/second -->
  <!-- They die after 10-25 are killed -->
  <action type='slow'>
    <var type='set' name='killed'>0</var>
    <ctl>$killed &lt; 5 + (5 * $playersAlive)</ctl>
    <repeat type='slow'>
      <times>9999</times>
      <action type='fast'>
        <action type='slow'>
          <spawn>
            <enemy/>
          </spawn>
          <var type='add' name='killed'>1</var>
        </action>
        <wait type='time'>60 / $playerNum</wait>
      </action>
    </repeat>
  </action>
  <wait type='time'>120</wait>
  <!-- Part 3 -->
  <!-- Spawn 6 enemies/second -->
  <!-- They die after 8s~25s with ~16s being the most probable -->
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
  <!-- Part 4 -->
  <!-- Spawn 10 + s, 9 + s, 8 + s,... s enemies -->
  <!-- They die after 6s-14s depending on number of players alive -->
  <!-- s is the number of Enemies that died due to the time limit and weren't killed by players -->
  <action type='slow'>
    <var type='set' name='wave'>10</var>
    <repeat type='slow'>
      <times>10</times>
      <action type='slow'>
        <var type='set' name='survivors'>0</var>
        <repeat type='fast'>
          <ttl>1000 - $playersAlive * 150</ttl>
          <times>$wave + $survivors</times>
          <action type='slow'>
            <var type='add' name='survivors'>1</var>
            <spawn>
              <enemy/>
            </spawn>
            <var type='add' name='survivors'>-1</var>
          </action>
        </repeat>
        <wait type='time'>60</wait>
        <var type='add' name='wave'>0-1</var>
      </action>
    </repeat>
    <repeat type='fast'>
      <times>$survivors</times>
      <action type='slow'>
        <spawn>
          <enemy/>
        </spawn>
      </action>
     </repeat>
  </action>
</action>
</document>`;
